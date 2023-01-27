import { ethers } from "hardhat";

// Import the compiled contract bytecode and ABI
import bytecode from "./Post.bin";
import abi from "./Post.abi";

async function main() {
    // Connect to the local Hardhat network
    const provider = ethers.provider;

    // Get the first account from the provider
    const signer = provider.getSigner();

    // Deploy the contract
    const contract = new ethers.ContractFactory(abi, bytecode, signer);
    const deployment = await contract.deploy();
    console.log("Contract deployed at:", deployment.address);
}

main()
    .then(() => process.exit(0))
    .catch((error: any) => {
        console.error(error);
        process.exit(1);
    });