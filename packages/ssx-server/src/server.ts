import { generateNonce, SiweError, SiweMessage } from 'siwe';
import { SiweGnosisVerify } from '@spruceid/ssx-gnosis-extension';
import axios, { AxiosInstance } from 'axios';
import {
  SSXEnsData,
  SSXEnsResolveOptions,
  ssxResolveEns,
  getProvider,
  ssxResolveLens,
  SSXLensProfilesResponse,
} from '@spruceid/ssx-core';
import {
  SSXLogFields,
  SSXServerConfig,
  SSXEventLogTypes,
  SSXServerBaseClass,
  ssxLog,
} from '@spruceid/ssx-core/server';
import { ethers, utils } from 'ethers';
import { SessionData, SessionOptions } from 'express-session';
import session from 'express-session';
import { RequestHandler } from 'express';

/**
 * SSX-Server is a server-side library made to work with the SSX client libraries.
 * SSX-Server is the base class that takes in a configuration object and works
 * with various middleware libraries to add authentication and metrics to your server.
 */
export class SSXServer extends SSXServerBaseClass {
  /** SSXServerConfig object. */
  protected _config: SSXServerConfig;
  /** Axios instance. */
  protected _api: AxiosInstance;
  /** EthersJS provider. */
  public provider: ethers.providers.BaseProvider;
  /** Session is a configured instance of express-session middleware. */
  public session: RequestHandler;

  constructor(config: SSXServerConfig = {}) {
    super();
    this._setDefaults();

    Object.assign(this._config, {
      ...config,
    });

    this.session = session(this.getExpressSessionConfig());

    const baseURL =
      this._config.providers?.metrics?.service === 'ssx'
        ? 'https://api.ssx.id'
        : '';

    this._api = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${config.providers?.metrics?.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (config.providers?.rpc) {
      this.provider = getProvider(config.providers.rpc);
    }
  }

  /**
   * Sets default values for optional configurations
   */
  protected _setDefaults = (): void => {
    this._config = {};
    this._config.providers = {};
    this._config.useSecureCookies = process.env.NODE_ENV === 'production';
  };

  /**
   * Registers a new event to the API
   * @param data - SSXLogFields object.
   * @returns True (success) or false (fail).
   */
  public log = async (data: SSXLogFields): Promise<boolean> => {
    return ssxLog(this._api, this._config.providers?.metrics?.apiKey, data);
  };

  /**
   * Generates a nonce for use in the SSX client libraries.
   * Nonce is a random string that is used to prevent replay attacks.
   * Wraps the generateNonce function from the SIWE library.
   * @returns A nonce string.
   */
  public generateNonce = generateNonce;

  /**
   * Verifies the SIWE message, signature, and nonce for a sign-in request.
   * If the message is verified, a session token is generated and returned.
   * @param siwe - SIWE Message.
   * @param signature - The signature of the SIWE message.
   * @param daoLogin - Whether or not daoLogin is enabled.
   * @param resolveEns - Resolve ENS settings.
   * @param nonce - nonce string.
   * @param resolveLens - Resolve Lens settings.
   * @returns Request data with SSX Server Session.
   */
  public login = async (
    siwe: Partial<SiweMessage> | string,
    signature: string,
    daoLogin: boolean,
    resolveEns: boolean | SSXEnsResolveOptions,
    nonce: string,
    resolveLens?: boolean,
  ): Promise<{
    success: boolean;
    error: SiweError;
    session: Partial<SessionData>;
  }> => {
    const siweMessage = new SiweMessage(siwe);

    let siweMessageVerifyPromise: any = siweMessage
      .verify(
        { signature, nonce },
        {
          verificationFallback: daoLogin ? SiweGnosisVerify : undefined,
          provider: this.provider,
        },
      )
      .then((data) => data);

    let ens: SSXEnsData = {};
    const promises: Array<Promise<any>> = [siweMessageVerifyPromise];
    if (resolveEns) {
      let resolveEnsOpts;
      if (resolveEns !== true) {
        resolveEnsOpts = resolveEns;
      }
      promises.push(this.resolveEns(siweMessage.address, resolveEnsOpts));
    }
    
    let lens: string | SSXLensProfilesResponse;
    if (resolveLens) {
      promises.push(this.resolveLens(siweMessage.address));
    }

    try {
      siweMessageVerifyPromise = await Promise.all(promises).then(
        ([siweMessageVerify, ensData, lensData]) => {
          if (!resolveEns && resolveLens) {
            [ensData, lensData] = [undefined, ensData];
          }
          ens = ensData;
          lens = lensData;
          return siweMessageVerify;
        },
      );
    } catch (error) {
      console.error(error);
      throw error;
    }

    const { success, error, data } = siweMessageVerifyPromise;

    let smartContractWalletOrCustomMethod = false;
    try {
      // TODO: Refactor this function.
      /** This addresses the cases where having DAOLogin
       *  enabled would make all the logs to be of Gnosis Type
       **/
      smartContractWalletOrCustomMethod = !(
        utils.verifyMessage(data.prepareMessage(), signature) === data.address
      );
    } catch (error) {
      console.error(error);
      throw error;
    }

    const event = {
      userId: `did:pkh:eip155:${data.chainId}:${data.address}`,
      type: SSXEventLogTypes.LOGIN,
      content: {
        signature,
        siwe,
        isGnosis: daoLogin && smartContractWalletOrCustomMethod,
      },
    };

    this.log(event);
    this.emit(event.type, event);

    return {
      success,
      error,
      session: {
        siwe: new SiweMessage(siwe),
        signature: signature,
        daoLogin: daoLogin,
        ens,
        lens,
      },
    };
  };

  /**
   * ENS data supported by SSX.
   * @param address - User address.
   * @param resolveEnsOpts - Options to resolve ENS.
   * @returns Object containing ENS data.
   */
  public resolveEns = async (
    /* User Address */
    address: string,
    /* ENS resolution settings */
    resolveEnsOpts?: SSXEnsResolveOptions,
  ): Promise<SSXEnsData> => {
    return ssxResolveEns(this.provider, address, resolveEnsOpts);
  };

  /**
   * Resolves Lens profiles owned by the given Ethereum Address. Each request is 
   * limited by 10. To get other pages you must to pass the pageCursor parameter.
   * 
   * Lens profiles can be resolved on the Polygon Mainnet (matic) or Mumbai Testnet
   * (maticmum). Visit https://docs.lens.xyz/docs/api-links for more information.
   *  
   * @param address - Ethereum User address.
   * @param pageCursor - Page cursor used to paginate the request. Default to 
   * first page. Visit https://docs.lens.xyz/docs/get-profiles#api-details for more 
   * information.
   * @returns Object containing Lens profiles items and pagination info.
   */
  async resolveLens(
    /* Ethereum User Address. */
    address: string,
    /* Page cursor used to paginate the request. Default to first page. */
    pageCursor: string = "{}"
  ): Promise<string | SSXLensProfilesResponse> {
    return ssxResolveLens(this.provider, address, pageCursor);
  }

  /**
   * Logs out the user by deleting the session.
   * Currently this is a no-op.
   * @param destroySession - Method to remove session from storage.
   * @returns Promise with true (success) or false (fail).
   */
  public logout = async (
    destroySession?: () => Promise<any>,
  ): Promise<boolean> => {
    return destroySession?.();
  };

  /**
   * Gets Express Session config params to configure the session.
   * @returns Session options.
   */
  public getExpressSessionConfig = (): SessionOptions => {
    return {
      ...this.getDefaultExpressSessionConfig(),
      ...this._config.providers?.sessionConfig?.sessionOptions,
      ...(this._config.providers?.sessionConfig?.store
        ? { store: this._config.providers?.sessionConfig?.store(session) }
        : {}),
    };
  };

  /**
   * Gets default Express Session Config.
   * @returns Default session options
   */
  protected getDefaultExpressSessionConfig = (): SessionOptions => ({
    name: 'ssx-session-storage',
    secret: this._config.signingKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: this._config.useSecureCookies,
    },
  });
}
