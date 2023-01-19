import { useContext, createContext, useState, useEffect } from 'react';
import { ReactNode } from 'react';
import type { SSX, SSXClientConfig } from '@spruceid/ssx';
// import { SSXProviderProps, SSXContextInterface } from './common';
// import { useSigner } from 'wagmi';

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

  if (clientRender) {
    if (web3Provider) {
      provider = web3Provider.provider;
      providerLoaded = web3Provider.providerLoaded || true;
    } else {
      let useSigner;
      const isESM = process.versions.modules !== '0';
      // const isESM = require.resolve.paths('wagmi');

      if (isESM) {
        // ESM module
        ({ useSigner } = require('wagmi'));
      } else {
        // CJS module
        ({ useSigner } = require('wagmi-cjs'));
      }
      ({ data: provider, isSuccess: providerLoaded } = (typeof window !==
        'undefined' &&
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
