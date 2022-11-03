import { SSX, SSXConfig } from "@spruceid/ssx";
import { useEffect, useState } from 'react';
import { useSigner } from 'wagmi';

export function useSSX({ ssxConfig }: { ssxConfig?: SSXConfig }) {
    const { data: signer, isSuccess: signerLoaded  } = useSigner()
    const [ssx, setSSX] = useState<SSX>();

    useEffect(() => {
       async function initializeSSX() {
            const { SSX } = await import('@spruceid/ssx');
            const modifiedSSXConfig = {
                ...ssxConfig,
                providers: {
                    ...ssxConfig?.providers,
                    web3: { 
                        ...ssxConfig?.providers?.web3,
                        driver: signer?.provider,
                    },
                }
            };
            const ssxInstance = new SSX(modifiedSSXConfig);
            setSSX(ssxInstance);
        }
        if (signerLoaded && signer) {
            initializeSSX();
        }
    }, [signer, signerLoaded, ssxConfig]);   
    
    return { ssx }
}
