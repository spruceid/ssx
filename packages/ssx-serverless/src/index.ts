import { generateNonce, SiweMessage } from 'siwe';
import { SiweGnosisVerify } from '@spruceid/ssx-gnosis-extension';
import axios, { AxiosInstance } from 'axios';
import {
  SSXServerConfig,
  SSXSessionCRUDConfig,
  SSXSessionData,
  SSXEnsData as ISSXEnsData,
} from './types';
import {
  SSXEnsResolveOptions,
  SSXEnsData,
  getProvider,
  ssxResolveEns,
  SSXLensProfilesResponse,
  ssxResolveLens,
} from '@spruceid/ssx-core';
import {
  SSXLogFields,
  SSXEventLogTypes,
  ssxLog,
} from '@spruceid/ssx-core/server';
import { ethers, utils } from 'ethers';

/**
 * SSX-Server is a server-side library made to work with the SSX client libraries.
 * SSX-Server is the base class that takes in a configuration object to add
 * authentication and metrics to your server.
 */
export class SSXServer {
  /** SSXServerConfig object. */
  private _config: SSXServerConfig = {};
  /** Axios instance. */
  private _api: AxiosInstance;
  /** EthersJS provider. */
  public provider: ethers.providers.BaseProvider;
  /** Definition of CRUD functions for sessions. */
  public session: SSXSessionCRUDConfig;

  /**
   * @param config - Base configuration of the SSXServer.
   * @param session - CRUD definition for session operations.
   * @example
   * ```
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
   * ```
   */
  constructor(config: SSXServerConfig, session: SSXSessionCRUDConfig) {
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
   * Registers a new event to the API.
   * @param data - SSXLogFields JSON.
   * @returns Promise with true (success) or false (fail).
   */
  public log = async (data: SSXLogFields): Promise<boolean> => {
    this._api;
    return ssxLog(
      this._api,
      this._config.providers?.metrics?.apiKey ?? '',
      data
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
   * Tries to update the session to store the new nonce.
   * @param sessionKey - Session identifier.
   * @param value - Value to update statement.
   * @param opts - Optional parameters.
   * @returns Object with update result.
   */
  private updateSessionNonce = async (
    /* The session with this key will be updated. */
    sessionKey: string,
    /** Value for the update statement. */
    value: any,
    /* Optional parameters to be passed to session.update. */
    opts: any
  ): Promise<{
    success: boolean;
    dbResult: any;
  }> => {
    let dbResult;
    try {
      dbResult = await this.session.update(sessionKey, value, opts);
    } catch (error) {
      throw {
        success: false,
        dbResult: error,
      };
    }
    return {
      success: true,
      dbResult,
    };
  };

  /**
   * Tries to create a session to store and store a nonce.
   * @param value - Value for the create statement.
   * @param opts - Optional parameters.
   * @returns Object with create result.
   */
  private createSessionNonce = async (
    /** Value for the create statement */
    value: any,
    /* Optional parameters to be passed to session.create. */
    opts: any
  ): Promise<{
    success: boolean;
    dbResult: any;
  }> => {
    let dbResult;
    try {
      dbResult = await this.session.create(value, opts);
    } catch (error) {
      throw {
        success: false,
        dbResult: error,
      };
    }
    return {
      success: true,
      dbResult,
    };
  };

  /**
   * Generates a nonce and stores it in the current session
   * if a sessionKey is provided or creates a new one if not.
   * @param getNonceOpts - Optional params to configure session management.
   * @returns Promise with nonce and database result.
   */
  public getNonce = async (getNonceOpts?: {
    /* If provided the session with this key will be updated. */
    sessionKey?: any;
    /* A function that will return the value for the update statement. */
    generateUpdateValue?: (nonce: string) => any;
    /* A function that will return the value for the create statement. */
    generateCreateValue?: (nonce: string) => any;
    /* Optional parameters to be passed to session.create. */
    createOpts?: Record<string, any>;
    /* Optional parameters to be passed to session.update. */
    updateOpts?: Record<string, any>;
  }): Promise<{ nonce: string; dbResult: any }> => {
    const nonce = generateNonce();

    let dbResult;
    if (getNonceOpts) {
      let updateSessionResponse;
      if (getNonceOpts?.sessionKey) {
        const updateValue = getNonceOpts.generateUpdateValue?.(nonce) ?? nonce;
        try {
          updateSessionResponse = await this.updateSessionNonce(
            getNonceOpts?.sessionKey,
            updateValue,
            getNonceOpts?.updateOpts
          );
        } catch (error) {
          updateSessionResponse = error;
        }
      }
      /* 
        If I don't have a sessionKey (to update) 
        OR
        I have a sessionKey (to update) but the update returned success=false
      */
      if (
        !getNonceOpts.sessionKey ||
        (getNonceOpts.sessionKey && !updateSessionResponse?.success)
      ) {
        const createValue = getNonceOpts.generateCreateValue?.(nonce) ?? {
          nonce,
          address: getNonceOpts.sessionKey,
        };
        try {
          dbResult = (
            await this.createSessionNonce(createValue, getNonceOpts?.createOpts)
          ).dbResult;
        } catch (error) {
          dbResult = error.dbResult;
        }
      }
    }

    return { nonce, dbResult };
  };

  /**
   * Verifies the SIWE message, signature, and nonce for a sign-in request.
   * If the message is verified, a session token is generated and returned.
   * @param siwe - Object containing the siwe fields or EIP-4361 message.
   * @param signature - Signature of the EIP-4361 message.
   * @param sessionKey - Key used to index user's session.
   * @param signInOpts - Additional options to customize sign-in behavior.
   * @returns Object containing information about the session.
   */
  public signIn = async (
    siwe: Partial<SiweMessage> | string,
    signature: string,
    /* Session key to be used in session lookup. */
    sessionKey: any,
    signInOpts: {
      /* Enables lookup for delegations. */
      daoLogin?: boolean;
      /* Enables ENS Domain resolution. */
      resolveEnsDomain?: boolean;
      /* Enables ENS Avatar resolution. */
      resolveEnsAvatar?: boolean;
      /* Enables Lens profiles resolution. */
      resolveLens?: boolean;
      /* Optional parameters to be passed to session.retrieve. */
      retrieveOpts?: Record<string, any>;
      /* A function that will return the value for the update statement. */
      generateUpdateValue?: (sessionData: SSXSessionData) => any;
      /* Optional parameters to be passed to session.create. */
      updateOpts?: Record<string, any>;
    }
  ): Promise<SSXSessionData> => {
    let session: any;
    try {
      session = await this.session.retrieve(sessionKey);
    } catch (error) {
      console.error(error);
      throw error;
    }

    if (
      session.nonce === null ||
      session.nonce === undefined ||
      typeof session.nonce !== 'string'
    ) {
      throw new Error('Invalid nonce.');
    }

    const siweMessage = new SiweMessage(siwe);

    let siweMessageVerifyPromise: any = siweMessage
      .verify(
        { signature, nonce: session.nonce },
        {
          verificationFallback: signInOpts?.daoLogin
            ? SiweGnosisVerify
            : undefined,
          provider: this.provider,
        }
      )
      .then(data => data)
      .catch(error => {
        console.error(error);
        throw error;
      });

    const promises: Array<Promise<any>> = [siweMessageVerifyPromise];

    let ens: ISSXEnsData = {};
    const resolveEns =
      signInOpts?.resolveEnsDomain || signInOpts?.resolveEnsAvatar;
    if (resolveEns) {
      const resolveEnsOpts = {
        domain: signInOpts?.resolveEnsDomain,
        avatar: signInOpts?.resolveEnsAvatar,
      };
      promises.push(this.resolveEns(siweMessage.address, resolveEnsOpts));
    }

    let lens: string | SSXLensProfilesResponse;
    const resolveLens = signInOpts?.resolveLens;
    if (resolveLens) {
      promises.push(this.resolveLens(siweMessage.address));
    }

    try {
      siweMessageVerifyPromise = await Promise.all(promises).then(
        ([siweMessageVerify, ensData, lensData]) => {
          if (!resolveEns && resolveLens) {
            [ensData, lensData] = [undefined, ensData];
          }
          lens = lensData;
          if (ensData?.domain) {
            ens['ensName'] = ensData.domain;
          }
          if (ensData?.avatarUrl) {
            ens['ensAvatarUrl'] = ensData.avatarUrl;
          }
          return siweMessageVerify;
        }
      );
    } catch (error) {
      console.error(error);
    }

    if (!siweMessageVerifyPromise.success) {
      throw siweMessageVerifyPromise.error;
    }

    const sessionData: SSXSessionData = {
      siweMessage,
      signature,
      daoLogin: !!signInOpts?.daoLogin,
      ens,
      lens,
    };

    const updateValue =
      signInOpts.generateUpdateValue?.(sessionData) ?? sessionData;
    try {
      await this.session.update(
        sessionKey,
        updateValue,
        signInOpts?.updateOpts
      );
    } catch (error) {
      console.error(error);
      throw error;
    }

    let smartContractWalletOrCustomMethod = false;
    try {
      // TODO: Refactor this function.
      /** This addresses the cases where having DAOLogin
       *  enabled would make all the logs to be of Gnosis Type
       **/
      smartContractWalletOrCustomMethod = !(
        utils.verifyMessage(siweMessage.prepareMessage(), signature) ===
        siweMessage.address
      );
    } catch (error) {
      console.error(error);
    }

    this.log({
      userId: `did:pkh:eip155:${siweMessage.chainId}:${siweMessage.address}`,
      type: SSXEventLogTypes.LOGIN,
      content: {
        signature,
        siwe,
        isGnosis: signInOpts?.daoLogin && smartContractWalletOrCustomMethod,
      },
    });

    return sessionData;
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
    pageCursor: string = '{}'
  ): Promise<string | SSXLensProfilesResponse> {
    return ssxResolveLens(this.provider, address, pageCursor);
  }

  /**
   * Calls the delete function to delete the user's session.
   * @param sessionKey - Key used to index sessions.
   * @param deleteOpts - Additional options to be passed to the seeion.delete function.
   * @returns The result of session.delete<T>.
   * @example
   * signOut<boolean>("0x9D85ca56217D2bb651b00f15e694EB7E713637D4")
   */
  public signOut = async <T>(
    sessionKey: any,
    deleteOpts?: Record<string, any>
  ): Promise<T> => {
    return await this.session.delete<T>(sessionKey, deleteOpts);
  };

  /**
   * Returns the SSXSessionData if a the session still exists and is valid.
   * @param sessionKey - Key used to index sessions.
   * @param getSSXDataFromSession - Function that will parse the resolved value from
   * session into SSXSessionData if the a custom session structure is being used.
   * @returns SSXSessionData.
   */
  public me = async (
    sessionKey: any,
    getSSXDataFromSession?: (session: any) => SSXSessionData
  ) => {
    const dbResult = await this.session.retrieve(sessionKey);
    if (!dbResult) {
      throw new Error('Unable to retrieve session.');
    }
    let session: SSXSessionData;
    let castingError: any;
    try {
      session = dbResult as SSXSessionData;
    } catch (error) {
      castingError = error;
    }

    if (!session) {
      if (!getSSXDataFromSession) {
        console.error(castingError);
        throw castingError;
      }
      session = getSSXDataFromSession(dbResult);
    }

    const siweMessage = new SiweMessage(session.siweMessage);
    await siweMessage.verify(
      { signature: session.signature },
      {
        verificationFallback: this._config.daoLogin
          ? SiweGnosisVerify
          : undefined,
        provider: this.provider,
      }
    );
    return session;
  };
}

export * from '@spruceid/ssx-core';
export * from '@spruceid/ssx-core/server';
export { SSXLogFields, SSXEventLogTypes };
export {
  SSXSessionCRUDConfig,
  SSXSessionData,
  SSXEnsData,
  SSXServerConfig,
  /** @deprecated use SSXServerConfig field instead */
  SSXServerConfig as SSXConfig,
  SSXServerProviders,
  /** @deprecated use SSXServerProviders field instead */
  SSXServerProviders as SSXProviders,
} from './types';
