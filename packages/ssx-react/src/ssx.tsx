import React, {
  useContext,
  createContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import ssx from '@spruceid/ssx';
import { useSigner } from 'wagmi';
import { watchAccount, watchSigner } from 'wagmi/actions';

const { SSX } = ssx;
type SSX = ssx.SSX;
type SSXClientConfig = ssx.SSXClientConfig;

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
const SSXContext = createContext<SSXContextInterface>({
  ssx: undefined,
  ssxLoaded: false,
});

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
    if (typeof window !== 'undefined') {
      const { data, isSuccess } = useSigner();
      provider = data?.provider;
      providerLoaded = isSuccess;
    }
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

  const unwatch = watchAccount(async (signer) => {
    if (signer && ssxConfig && ssxConfig.siweConfig) {
      if (signer.address != ssxConfig.siweConfig.address) {
        ssxConfig.siweConfig.address = signer.address
      }
    }
  })

  useEffect(() => {
    async function initializeSSX() {
<<<<<<< HEAD
      const { SSX } = await import('@spruceid/ssx');
=======
>>>>>>> c4a3c9bd0790becf9200d0e8d14839283f3a73aa
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
      console.log("in use effect", modifiedSSXConfig.siweConfig.address)

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
