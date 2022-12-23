import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { SSX, SSXClientConfig } from '@spruceid/ssx';
import { useSigner } from 'wagmi';
// /** Approach B */
// import { getCsrfToken, signIn, signOut } from 'next-auth/react';
// import type {
//   SignInOptions,
//   SignOutParams,
//   SignInAuthorizationParams,
// } from 'next-auth/react';
// /** Approach B */

/** Interface for SSX Web3 Provider. */
export interface SSXWeb3Provider {
  /** web3 Provider. */
  provider: any;
  /** web3 Provider Loaded. */
  providerLoaded?: boolean;
}

/** Props for SSX Provider. */
export interface SSXProviderProps {
  /** Optional SSX configuration, used for instantiating an SSX Instance. */
  ssxConfig?: SSXClientConfig;
  /** Provider child nodes, for rendering. */
  children: ReactNode;
  /** Optional SSX Signer. Will . */
  web3Provider?: SSXWeb3Provider;
}

/** Interface for contents provided to the Hook. */
export interface SSXContextInterface {
  /** SSX Instance. */
  ssx: SSX | undefined;
  /** SSX Instance loading state. */
  ssxLoaded: boolean;
  // /** Approach B */
  // /** NextAuth Sign In function. */
  // signIn?: (
  //   options?: SignInOptions,
  //   authorizationParams?: SignInAuthorizationParams
  // ) => Promise<any>;
  // /** NextAuth Sign Out function. */
  // signOut?: (options?: SignOutParams) => Promise<any>;
  // /** Approach B */
}

/** Default, uninitialized context. */
const defaultContext: SSXContextInterface = {
  ssx: undefined,
  ssxLoaded: false,
  // /** Approach B */
  // signIn: undefined,
  // signOut: undefined,
  // /** Approach B */
};

const SSXContext = createContext(defaultContext);

/** SSX Provider Component. */
export const SSXProvider = ({
  ssxConfig,
  children,
  web3Provider,
}: SSXProviderProps) => {
  let provider, providerLoaded;
  let usingWagmi = false;

  if (web3Provider) {
    provider = web3Provider.provider;
    providerLoaded = web3Provider.providerLoaded || true;
  } else {
    // assume using wagmi.sh if no provider is provided
    usingWagmi = true;
    ({ data: provider, isSuccess: providerLoaded } = (typeof window !==
      'undefined' &&
      useSigner()) || { data: undefined, isSuccess: false });
  }

  const [ssx, setSSX] = useState<SSX>();
  const [ssxLoaded, setSSXLoaded] = useState(false);

  // /** Approach B */

  // const nextSignIn = async (
  //   options?: SignInOptions,
  //   authorizationParams?: SignInAuthorizationParams
  // ) => {
  //   if (ssxLoaded) {
  //     // const csrfToken = await getCsrfToken();
  //     // inject nonce into siweConfig
  //     const { siwe, signature } = await ssx?.signIn();
  //     return signIn(
  //       'credentials',
  //       { message: siwe, signature, ...options },
  //       authorizationParams
  //     );
  //   }
  // };
  // const nextSignOut = async (options?: SignOutParams) => {
  //   if (ssxLoaded) {
  //     await ssx?.signOut();
  //     return signOut(options);
  //   }
  // };
  // /** Approach B */

  useEffect(() => {
    async function initializeSSX() {
      const { SSX } = await import('@spruceid/ssx');
      // const csrfToken = await getCsrfToken(); // Approach B

      const modifiedSSXConfig = {
        ...ssxConfig,
        siweConfig: {
          ...ssxConfig?.siweConfig,
          // nonce: csrfToken,  // Approach B
        },
        providers: {
          ...ssxConfig?.providers,
          web3: {
            driver: usingWagmi ? provider?.provider : provider,
            ...ssxConfig?.providers?.web3,
          },
        },
      };
      const ssxInstance = new SSX(modifiedSSXConfig);
      setSSX(ssxInstance);
      setSSXLoaded(true);
    }
    if (providerLoaded && provider) {
      initializeSSX();
    }
  }, [provider, providerLoaded, ssxConfig]);

  const SSXProviderValue: SSXContextInterface = {
    ssx,
    ssxLoaded,
    // /** Approach B */
    // signIn: nextSignIn,
    // signOut: nextSignOut,
    // /** Approach B */
  };

  return (
    <SSXContext.Provider value={SSXProviderValue}>
      {children}
    </SSXContext.Provider>
  );
};

/** Hook for accessing SSX instance and state. */
export const useSSX = (): SSXContextInterface => {
  return useContext(SSXContext);
};
