import {
  useContext,
  createContext,
  useState,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import { SSX, SSXClientConfig } from '@spruceid/ssx';
import { useSigner } from 'wagmi';

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
}

/** Default, uninitialized context. */
const defaultContext: SSXContextInterface = {
  ssx: undefined,
  ssxLoaded: false,
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

  const [ssxState, setSSXState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      ssx: undefined,
      ssxLoaded: false,
    }
  );
  const { ssx, ssxLoaded } = ssxState;
  const setSSX = (ssx: SSX) => setSSXState({ ssx });
  const setSSXLoaded = (ssxLoaded: boolean) => setSSXState({ ssxLoaded });

  useEffect(() => {
    async function initializeSSX() {
      const { SSX } = await import('@spruceid/ssx');

      const modifiedSSXConfig = {
        ...ssxConfig,
        siweConfig: {
          ...ssxConfig?.siweConfig,
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
