import { useContext, createContext, useState, useEffect } from 'react';
import type { SSX } from '@spruceid/ssx';
import { SSXProviderProps, SSXContextInterface } from './common';
import { useSigner } from 'wagmi-cjs';

/** Default, uninitialized context. */
const defaultContext: SSXContextInterface = {
  ssx: undefined,
  ssxLoaded: false,
};

const clientRender = typeof window !== 'undefined';
const SSXContext = createContext(defaultContext);

export const SSXProvider = ({
  ssxConfig,
  children,
  web3Provider,
}: SSXProviderProps) => {
  let provider, providerLoaded;

  if (clientRender) {
    if (web3Provider) {
      provider = web3Provider.provider;
      providerLoaded = web3Provider.providerLoaded || true;
    } else {
      ({ data: provider, isSuccess: providerLoaded } = (clientRender &&
        useSigner &&
        useSigner()) || { data: undefined, isSuccess: false });
    }
  }

  const [ssx, setSSX] = useState<SSX | undefined>(undefined);
  const [ssxLoaded, setSSXLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function initializeSSX() {
      const { SSX } = await import('@spruceid/ssx');
      // console.log('provider', provider);
      // console.log('providerLoaded', providerLoaded);
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
      setSSXLoaded(true);
    }

    initializeSSX();
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
