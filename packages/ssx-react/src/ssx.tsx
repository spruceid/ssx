import {
  useContext,
  createContext,
  useState,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import type { SSX, SSXClientConfig } from '@spruceid/ssx';
import { useSigner } from '@spruceid/ssx-wagmi';

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

const clientRender = typeof window !== 'undefined';
const SSXContext = createContext(defaultContext);

/** SSX Provider Component. */
export const SSXProvider = ({
  ssxConfig,
  children,
  web3Provider,
}: SSXProviderProps) => {
  let provider, providerLoaded;
  const usingWagmi = !web3Provider;

  // const [provider, setProvider] = useState<any>(undefined);
  // const [providerLoaded, setProviderLoaded] = useState<boolean>(false);
  const [SSXClass, setSSXClass] = useState<any>(undefined);

  
  if (clientRender) {
    if (web3Provider) {
      provider = web3Provider.provider;
      providerLoaded = web3Provider.providerLoaded || true;
      // setProvider(provider);
      // setProviderLoaded(web3Provider.providerLoaded || true);
    } else {
      // const { useSigner } = await import('wagmi');
      ({ data: provider, isSuccess: providerLoaded } = (typeof window !==
        'undefined' &&
        useSigner()) || { data: undefined, isSuccess: false });
    }
    // import('wagmi').then(({ useSigner }) => {
    //   console.log('wagmi');
    //   console.log('useSigner', useSigner);

    //   const { data, isSuccess } = useSigner();
    //   setProvider(data?.provider);
    //   setProviderLoaded(isSuccess);
    // });

    import('@spruceid/ssx').then(({ SSX }) => {
      console.log('@spruceid/ssx');
      console.log('SSX', SSX);
      setSSXClass(SSX);
    });
  }

  const [ssx, setSSX] = useState<SSX | undefined>(undefined);
  const [ssxLoaded, setSSXLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function initializeSSX() {
      // const { SSX } = await import('@spruceid/ssx');

      // if (usingWagmi) {
      //   const { useSigner } = await import('wagmi');
      //   ({ data: provider, isSuccess: providerLoaded } = (typeof window !==
      //     'undefined' &&
      //     useSigner()) || { data: undefined, isSuccess: false });
      // }

      console.log('provider', provider);
      console.log('providerLoaded', providerLoaded);
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
      const ssxInstance = new SSXClass(modifiedSSXConfig);
      setSSX(ssxInstance);
      setSSXLoaded(true);
    }
    // if (providerLoaded && provider) {
    // }
    console.log("iniitalizing ssx")
    initializeSSX();
    console.log("ssx initialized")
  }, [provider, providerLoaded, ssxConfig, SSXClass]);

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
