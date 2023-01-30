import { ethers } from "ethers";

const API_KEY = process.env.REACT_APP_API_KEY;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY as any;
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS as any;

const contract = require("./artifacts/contracts/Posts.sol/Posts.json");
const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", API_KEY);
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
const PostsContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

export default PostsContract;