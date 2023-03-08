import { SSX } from '@spruceid/ssx';
import { ethers } from 'ethers';
import { config } from 'dotenv';
config();

const testMessage = 'Example `personal_sign` message';
const testSeed = process.env.SEED_PHRASE;

const main = async () => {
    const wallet = testSeed ? ethers.Wallet.fromMnemonic(testSeed) : ethers.Wallet.createRandom();
    const driver = new ethers.providers.JsonRpcProvider("https://eth.rpc.blxrbdn.com");
    const signer = wallet.connect(driver);

    const ssx = new SSX({
        resolveEns: false,
        enableDaoLogin: false,
        providers: {
            web3: { driver: driver as ethers.providers.Web3Provider, signer },
        },
    });
    
    const session = await ssx.signIn();
    console.log(session);
}

main().then(() => console.log("ssx-test-node-client complete."))