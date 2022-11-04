import { generateNonce, SiweError, SiweMessage } from 'siwe';
import { SiweGnosisVerify } from '@spruceid/ssx-gnosis-extension';
import axios, { AxiosInstance } from 'axios';
import { SSXLogFields, SSXServerConfig, SSXEventLogTypes, SSXSessionCRUDConfig, SSXSessionData, SSXEnsData } from './types';
import { getProvider } from './utils';
import { ethers, utils } from 'ethers';

/**
 * SSX-Server is a server-side library made to work with the SSX client libraries.
 * SSX-Server is the base class that takes in a configuration object to add 
 * authentication and metrics to your server.
 *
 **/
export class SSXServer {
  private _config: SSXServerConfig = {};
  private _api: AxiosInstance;
  /** EthersJS provider */
  public provider: ethers.providers.BaseProvider;
  /** Definition of CRUD functions for sessions */
  public session: SSXSessionCRUDConfig;

  /**
   * @param config Base configuration of the SSXServer
   * @param session CRUD definition for session operations
   * @example
   * const ssx = new SSXServer({
   *   providers: {
   *     rpc: {
   *       service: SSXRPCProviders.SSXInfuraProvider,
   *       apiKey: process.env.INFURA_ID,
   *       network: SSXInfuraProviderNetworks.GOERLI,
   *     }
   *   }
   * }, {
   *     create: async <T>(value: any, opts?: Record<string, any>): Promise<T> => { },
   *     retrieve: async <T>(key: any, opts?: Record<string, any>): Promise<T> => { },
   *     update: async <T>(key: any, value: any, opts?: Record<string, any>): Promise<T> => { },
   *     delete: async <T>(key: any): Promise<T> => { },
   * });
   */
  constructor(
    config: SSXServerConfig,
    session: SSXSessionCRUDConfig,
  ) {
    Object.assign(this._config, {
      ...config,
    });

    this.session = session;

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

    this.provider = getProvider(config.providers?.rpc);
  }

  /**
   * Abstracts the fetch API to append correct headers, host and parse
   * responses to JSON for POST requests.
   */
  private _post = (route: string, body: any): Promise<boolean> => {
    return this._api
      .post(route, typeof body === 'string' ? body : JSON.stringify(body))
      .then((res) => res.status === 204)
      .catch((e) => {
        console.error(e);
        return false;
      });
  };

  /** Registers a new event to the API */
  public log = async (data: SSXLogFields): Promise<boolean> => {
    if (!data.timestamp) { data.timestamp = new Date().toISOString() };
    return !!this._config.providers?.metrics?.apiKey && this._post('/events', data);
  };

  /**
   * Generates a nonce for use in the SSX client libraries.
   * Nonce is a random string that is used to prevent replay attacks.
   * Wraps the generateNonce function from the SIWE library.
   * @returns A nonce string.
   */
  public generateNonce = generateNonce;

  /**
   * Generates a nonce and stores it in the current session
   * if a sessionKey is provided or creates a new one if not.
   */
  public getNonce = async (
    getNonceOpts?: {
      /* If provided the session with this key will be updated */
      sessionKey?: any,
      /* A function that will return the value for the update statement */
      generateUpdateValue?: (nonce: string) => any,
      /* A function that will return the value for the create statement */
      generateCreateValue?: (nonce: string) => any,
      /* Optional parameters to be passed to session.create */
      createOpts?: Record<string, any>,
      /* Optional parameters to be passed to session.update */
      updateOpts?: Record<string, any>,
    }): Promise<{ nonce: string, dbResult: any }> => {
    const nonce = generateNonce();

    let dbResult;
    if (getNonceOpts) {
      try {
        const updateValue = getNonceOpts.generateUpdateValue?.(nonce) ?? nonce;
        dbResult = await this.session.update(getNonceOpts.sessionKey, updateValue, getNonceOpts?.updateOpts);
      } catch (error) {
        const createValue = getNonceOpts.generateCreateValue?.(nonce) ?? { nonce, address: getNonceOpts.sessionKey };
        dbResult = await this.session.create(createValue, getNonceOpts?.createOpts);
      }
    }

    return { nonce, dbResult };
  }

  /**
   * Verifies the SIWE message, signature, and nonce for a sign-in request.
   * If the message is verified, a session token is generated and returned.
   * @param siwe Object containing the siwe fields or EIP-4361 message
   * @param signature Signature of the EIP-4361 message
   * @param sessionKey Key used to index user's session
   * @param signInOpts Additional options to customize sign-in behavior
   * @returns {SSXSessionData} object containing information about the session
   */
  public signIn = async (
    siwe: SiweMessage | string,
    signature: string,
    /* Session key to be used in session lookup */
    sessionKey: any,
    signInOpts: {
      /* Enables lookup for delegations */
      daoLogin?: boolean,
      /* Enables ENS resolution */
      resolveEns?: boolean,
      /* Optional parameters to be passed to session.retrieve */
      retrieveOpts?: Record<string, any>,
      /* A function that will return the value for the update statement */
      generateUpdateValue?: (sessionData: SSXSessionData) => any,
      /* Optional parameters to be passed to session.create */
      updateOpts?: Record<string, any>,
    },
  ): Promise<SSXSessionData> => {
    let session: any;
    try {
      session = await this.session.retrieve(sessionKey);
    } catch (error) {
      const sessionError = new Error('Unable to retrieve session.');
      console.error(sessionError);
      throw sessionError;
    }

    let siweMessage;
    try {
      siweMessage = await new SiweMessage(siwe).verify(
        { signature, nonce: session?.nonce },
        {
          verificationFallback: signInOpts?.daoLogin ? SiweGnosisVerify : undefined,
          provider: this.provider,
        },
      );
    } catch (error) {
      console.error(error);
      throw error;
    }

    let ens: SSXEnsData = {};
    try {
      if (signInOpts?.resolveEns) {
        ens.ensName = await this.provider.lookupAddress(siweMessage.data.address);
        if (ens.ensName) {
          ens.ensAvatarUrl = await this.provider.getAvatar(ens.ensName);
        }
      }
    } catch (error) {
      console.error(error);
    }

    const sessionData: SSXSessionData = {
      siweMessage: siweMessage.data,
      signature,
      daoLogin: !!signInOpts?.daoLogin,
      ens
    };

    let dbResult;
    try {
      const updateValue = signInOpts.generateUpdateValue?.(sessionData) ?? sessionData;
      dbResult = await this.session.update(sessionKey, updateValue, signInOpts?.updateOpts);
    } catch (error) {
      const updateError = new Error('Unable to update session data.');
      console.error(updateError);
      throw updateError;
    }

    try {
      // TODO(w4ll3): Refactor this function.
      /** This addresses the cases where having DAOLogin
       *  enabled would make all the logs to be of Gnosis Type
       **/
      let smartContractWalletOrCustomMethod = false;
      smartContractWalletOrCustomMethod = !(
        utils.verifyMessage(siweMessage.data.prepareMessage(), signature) === siweMessage.data.address
      );

      this.log({
        userId: `did:pkh:eip155:${siweMessage.data.chainId}:${siweMessage.data.address}`,
        type: SSXEventLogTypes.LOGIN,
        content: {
          signature,
          siwe,
          isGnosis: signInOpts?.daoLogin && smartContractWalletOrCustomMethod,
        },
      });
    } catch (error) {
      console.error(error);
    }

    return sessionData;
  };

  /**
   * Calls the delete function to delete the user's session
   * @param sessionKey Key used to index sessions
   * @param deleteOpts Additional options to be passed to the seeion.delete function.
   * @returns The result of session.delete<T>
   * @example
   * signOut<boolean>("0x9D85ca56217D2bb651b00f15e694EB7E713637D4")
   */
  public signOut = async <T>(
    sessionKey: any,
    deleteOpts?: Record<string, any>,
  ): Promise<T> => {
    return await this.session.delete<T>(sessionKey, deleteOpts);
  };

  public me = async (sessionKey: any, getSSXDataFromSession?: (session: any) => SSXSessionData) => {
    let session;
    try {
      session = await this.session.retrieve(sessionKey);
      session = session as SSXSessionData
    } catch (error) {
      if(!getSSXDataFromSession) {
        console.error(error);
        throw error;
      }
      session = getSSXDataFromSession(session)
    }
    const siweMessage = new SiweMessage(session.siweMessage);
    siweMessage.verify(
      { signature: session.signature },
      {
        verificationFallback: this._config.daoLogin ? SiweGnosisVerify : undefined,
        provider: this.provider,
      },
    );
    return session;
  }
}

export * from "./types";
export * from "./utils";
