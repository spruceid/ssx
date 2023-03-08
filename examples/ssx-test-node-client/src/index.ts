import { SSX } from '@spruceid/ssx';
import { ethers } from 'ethers';



const main = async () => {
    const wallet = ethers.Wallet.createRandom();

    const signer = wallet.connect(
        new ethers.JsonRpcProvider("https://eth.rpc.blxrbdn.com")
    );
    const ssx = new SSX({
        resolveEns: false,
        enableDaoLogin: false,
        providers: {
            web3: { driver: signer.provider },
        },
    });
    
    const session = await ssx.signIn();
    console.log(session);
}

main().then(() => console.log("ssx-test-node-client complete."))