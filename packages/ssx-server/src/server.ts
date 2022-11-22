import { generateNonce, SiweError, SiweMessage } from 'siwe';
import { SiweGnosisVerify } from '@spruceid/ssx-gnosis-extension';
import axios, { AxiosInstance } from 'axios';
import {
  SSXLogFields,
  SSXServerConfig,
  SSXEventLogTypes,
  SSXEnsData,
  SSXEnsResolveOptions,
  ssxLog,
  ssxResolveEns,
  getProvider
} from '@spruceid/ssx-core';
import { ethers, utils } from 'ethers';
import { SessionData, SessionOptions } from 'express-session';
import session from 'express-session';
import { RequestHandler } from 'express';
import { EventEmitter } from 'events';

/**
 * SSX-Server is a server-side library made to work with the SSX client libraries.
 * SSX-Server is the base class that takes in a configuration object and works
 * with various middleware libraries to add authentication and metrics to your server.
 *
 **/
export class SSXServer extends EventEmitter {
  private _config: SSXServerConfig;
  private _api: AxiosInstance;
  public provider: ethers.providers.BaseProvider;
  /** session is a configured instance of express-session middleware */
  public session: RequestHandler;

  constructor(config: SSXServerConfig = {}) {
    super()
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

  /** Set default values for optional configurations */
  private _setDefaults = () => {
    this._config = {};
    this._config.providers = {};
    this._config.useSecureCookies = process.env.NODE_ENV === 'production';
  };

  /** Registers a new event to the API */
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
   */
  public login = async (
    siwe: SiweMessage | string,
    signature: string,
    daoLogin: boolean,
    resolveEns: boolean | SSXEnsResolveOptions,
    nonce: string,
  ): Promise<{
    success: boolean;
    error: SiweError;
    session: Partial<SessionData>;
  }> => {
    // TODO(w4ll3): Refactor this function.
    let smartContractWalletOrCustomMethod = false;
    try {
      const siweMessage = new SiweMessage(siwe);

      let siweMessageVerifyPromise: any = siweMessage.verify(
        { signature, nonce },
        {
          verificationFallback: daoLogin ? SiweGnosisVerify : undefined,
          provider: this.provider,
        },
      )
        .then(data => data)
        .catch(error => {
          console.error(error);
          throw error;
        });

      let ens: SSXEnsData = {};
      let promises: Array<Promise<any>> = [siweMessageVerifyPromise];
      if (resolveEns) {
        let resolveEnsOpts;
        if (resolveEns !== true) {
          resolveEnsOpts = resolveEns;
        }
        promises.push(this.resolveEns(siweMessage.address, resolveEnsOpts));
      }
      try {
        siweMessageVerifyPromise = await Promise.all(promises)
          .then(([siweMessageVerify, ensData]) => {
            ens = ensData
            return siweMessageVerify;
          });
      } catch (error) {
        console.error(error);
      }

      const { success, error, data } = siweMessageVerifyPromise;

      /** This addresses the cases where having DAOLogin
       *  enabled would make all the logs to be of Gnosis Type
       **/
      smartContractWalletOrCustomMethod = !(
        utils.verifyMessage(data.prepareMessage(), signature) === data.address
      );

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
        },
      };
    } catch (e) {
      return {
        success: false,
        error: e,
        session: {
          siwe: new SiweMessage(siwe),
          signature: signature,
          daoLogin: daoLogin,
        },
      };
    }
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
    resolveEnsOpts?: SSXEnsResolveOptions
  ): Promise<SSXEnsData> => {
    return ssxResolveEns(this.provider, address, resolveEnsOpts)
  };

  /**
   * Logs out the user by deleting the session.
   * Currently this is a no-op.
   */
  public logout = async (
    destroySession?: () => Promise<any>,
  ): Promise<boolean> => {
    return destroySession?.();
  };

  public getExpressSessionConfig = (): SessionOptions => {
    return {
      ...this.getDefaultExpressSessionConfig(),
      ...this._config.providers?.sessionConfig?.sessionOptions,
      ...(!!this._config.providers?.sessionConfig?.store
        ? { store: this._config.providers?.sessionConfig?.store(session) }
        : {}),
    };
  };

  private getDefaultExpressSessionConfig = (): SessionOptions => ({
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
