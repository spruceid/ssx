import { useContext, createContext, useState, useEffect, ReactNode } from 'react';
import { SSX, SSXConfig } from "@spruceid/ssx";
import { useSigner } from 'wagmi';

export interface SSXProviderProps {
  ssxConfig?: SSXConfig;
  children: ReactNode;
}

const defaultContext = {
  ssx: undefined,
  ssxLoaded: false,
};

const SSXContext = createContext(defaultContext);

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

  const SSXProviderValue = {
    ssx,
    ssxLoaded,
  };

  return (
    <SSXContext.Provider value={SSXProviderValue}>
      {children}
    </SSXContext.Provider>
  );
}


export const useSSX = () => {
  return useContext(SSXContext);
};