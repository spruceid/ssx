import { useContext, createContext, useState, useEffect, ReactNode } from 'react';
import { SSX, SSXConfig } from "@spruceid/ssx";
import { useSigner } from 'wagmi';

/** Props for SSX Provider */
export interface SSXProviderProps {
  /** Optional SSX configuration, used for instantiating an SSX Instance */
  ssxConfig?: SSXConfig;
  /** Provider child nodes, for rendering*/
  children: ReactNode;
}

/** Interface for contents provided to the Hook */
export interface SSXContextInterface {
  /** SSX Instance */
  ssx: SSX | undefined;
  /** SSX Instance loading state */
  ssxLoaded: boolean;
}

/** Default, uninitialized context */
const defaultContext: SSXContextInterface = {
  ssx: undefined,
  ssxLoaded: false,
};

const SSXContext = createContext(defaultContext);

/** SSX Provider Component */
export const SSXProvider = ({ ssxConfig, children }: SSXProviderProps) => {
  const { data: signer, isSuccess: signerLoaded } = (typeof window !== 'undefined' && useSigner()) || { data: undefined, isSuccess: false };
  const [ssx, setSSX] = useState<SSX>();
  const [ssxLoaded, setSSXLoaded] = useState(false);

  useEffect(() => {
    async function initializeSSX() {
      const { SSX } = await import('@spruceid/ssx');
      const modifiedSSXConfig = {
        ...ssxConfig,
        providers: {
          ...ssxConfig?.providers,
          web3: {
            driver: signer?.provider,
            ...ssxConfig?.providers?.web3,
          },
        }
      };
      const ssxInstance = new SSX(modifiedSSXConfig);
      setSSX(ssxInstance);
      setSSXLoaded(true);
    }
    if (signerLoaded && signer) {
      initializeSSX();
    }
  }, [signer, signerLoaded, ssxConfig]);

  const SSXProviderValue: SSXContextInterface = {
    ssx,
    ssxLoaded,
  };

  return (
    <SSXContext.Provider value={SSXProviderValue}>
      {children}
    </SSXContext.Provider>
  );
}

/** Hook for accessing SSX instance and state */
export const useSSX = (): SSXContextInterface => {
  return useContext(SSXContext);
};