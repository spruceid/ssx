import React, {
  useContext,
  createContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import ssx from '@spruceid/ssx';
import { useSigner, useAccount } from 'wagmi';

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
  /** Optional on change account callback. */
  onChangeAccount?: (address: string, ssx: SSX) => Promise<void | SSX>;
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
  onChangeAccount,
}: SSXProviderProps) => {
  let provider, providerLoaded, walletAddress;
  let usingWagmi = false;

  if (web3Provider) {
    provider = web3Provider.provider;
    providerLoaded = web3Provider.providerLoaded || true;
  } else {
    // assume using wagmi.sh if no provider is provided
    usingWagmi = true;
    if (typeof window !== 'undefined') {
      const { data, isSuccess } = useSigner();
      const { address } = useAccount()
      provider = data?.provider;
      providerLoaded = isSuccess;
      walletAddress = address;
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

  const updateStateOnChange = async (address, ssx) => {
    if (onChangeAccount) {
      const newSSX = await onChangeAccount(address, ssx);
      if (newSSX) {
        setSSX(newSSX);
      }
    }
  }

  useEffect(() => {
    if(walletAddress) {
      if(ssx) {
        ssx.provider = provider.provider;
      }
      updateStateOnChange(walletAddress, ssx);
    }
  }, [walletAddress]);

  async function initializeSSX() {
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
    return ssx;
  }

  useEffect(() => {
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
