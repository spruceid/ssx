import { generateNonce, SiweError, SiweMessage } from 'siwe';
import { SiweGnosisVerify } from '@spruceid/ssx-gnosis-extension';
import axios, { AxiosInstance } from 'axios';
import { SSXLogFields, SSXServerConfig, SSXEventLogTypes } from './types';
import { getProvider } from './utils';
import { ethers, utils } from 'ethers';
import { SessionData, SessionOptions } from 'express-session';
import session from 'express-session';
import { RequestHandler } from 'express';

/**
 * SSX-Server is a server-side library made to work with the SSX client libraries.
 * SSX-Server is the base class that takes in a configuration object and works
 * with various middleware libraries to add authentication and metrics to your server.
 *
 **/
export class SSXServer {
  private _config: SSXServerConfig;
  private _api: AxiosInstance;
  public provider: ethers.providers.Provider;
  /** session is a configured instance of express-session middleware */
  public session: RequestHandler;

  constructor(config: SSXServerConfig = {}) {
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

  /**
   * Abstracts the fetch API to append correct headers, host and parse
   * responses to JSON for POST requests.
   */
  private _post = (route: string, body: any): Promise<boolean> => {
    return this._api
      .post(route, typeof body === 'string' ? body : JSON.stringify(body))
      .then((res) => res.status === 204)
      .catch((e) => {
        return false;
      });
  };

  /** Registers a new event to the API */
  public log = async (data: SSXLogFields): Promise<boolean> => {
    if (!data.timestamp) data.timestamp = new Date().toISOString();
    return (
      this._config.providers?.metrics?.apiKey && this._post('/events', data)
    );
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
    nonce: string,
  ): Promise<{
    success: boolean;
    error: SiweError;
    session: Partial<SessionData>;
  }> => {
    // TODO(w4ll3): Refactor this function.
    let smartContractWalletOrCustomMethod = false;
    try {
      const { success, error, data } = await new SiweMessage(siwe).verify(
        { signature, nonce },
        {
          verificationFallback: daoLogin ? SiweGnosisVerify : null,
          provider: this.provider,
        },
      );
      /** This addresses the cases where having DAOLogin
       *  enabled would make all the logs to be of Gnosis Type
       **/
      smartContractWalletOrCustomMethod = !(
        utils.verifyMessage(data.prepareMessage(), signature) === data.address
      );

      this.log({
        userId: `did:pkh:eip155:${data.chainId}:${data.address}`,
        type: SSXEventLogTypes.LOGIN,
        content: {
          signature,
          siwe,
          isGnosis: daoLogin && smartContractWalletOrCustomMethod,
        },
      });

      return {
        success,
        error,
        session: {
          siwe: new SiweMessage(siwe),
          signature: signature,
          daoLogin: daoLogin,
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
