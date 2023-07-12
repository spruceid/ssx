import React, {
  useContext,
  createContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import ssx from '@spruceid/ssx';

const { SSX } = ssx;
type SSX = ssx.SSX;
type SSXClientConfig = ssx.SSXClientConfig;

/** Interface for SSX Web3 Provider. */
export interface SSXWeb3Provider {
  /** web3 Provider. */
  provider: any;
}

/** Props for SSX Provider. */
export interface SSXProviderProps {
  /** Optional SSX configuration, used for instantiating an SSX Instance. */
  ssxConfig?: SSXClientConfig;
  /** Provider child nodes, for rendering. */
  children: ReactNode;
  /** Optional SSX Signer. Will . */
  web3Provider?: SSXWeb3Provider;
  /** Optional on change account callback. */
  watchProvider?: (provider: any, ssx: SSX) => Promise<void | SSX>;
}

/** Interface for contents provided to the Hook. */
export interface SSXContextInterface {
  /** SSX Instance. */
  ssx: SSX | undefined;
  /** Provider Instance. */
  provider: any;
}

/** Default, uninitialized context. */
const SSXContext = createContext<SSXContextInterface>({
  ssx: undefined,
  provider: undefined,
});

/** SSX Provider Component. */
export const SSXProvider = ({
  ssxConfig,
  children,
  web3Provider,
  watchProvider,
}: SSXProviderProps) => {
  const provider = web3Provider.provider;

  const [ssxState, setSSXState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      ssx: undefined,
      provider: web3Provider.provider,
    }
  );
  const { ssx } = ssxState;
  const setSSX = (ssx: SSX) => setSSXState({ ssx });
  const setProvider = (provider: any) => setSSXState({ provider });

  function initializeSSX() {
    const modifiedSSXConfig = {
      ...ssxConfig,
      siweConfig: {
        ...ssxConfig?.siweConfig,
      },
      providers: {
        ...ssxConfig?.providers,
        web3: {
          driver: provider,
          ...ssxConfig?.providers?.web3,
        },
      },
    };

    const ssxInstance = new SSX(modifiedSSXConfig);
    setSSX(ssxInstance);
    return ssx;
  }

  const updateStateOnChangeProvider = async (ssx) => {
    if(watchProvider) {
      const newSSX = await watchProvider(provider, ssx);
      if(newSSX) {
        setSSX(newSSX);
      }
    }
  }

  useEffect(() => {
    if(provider && !ssx) {
      initializeSSX();
    }
    if(ssx && provider) {
      ssx.provider = provider.provider;
    }
    updateStateOnChangeProvider(ssx);
    setProvider(provider);
  }, [provider, ssx]);

  const SSXProviderValue: SSXContextInterface = {
    ssx,
    provider,
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
