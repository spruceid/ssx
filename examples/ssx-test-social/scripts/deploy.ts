import { ethers } from "hardhat";

async function main() {
    const Posts = await ethers.getContractFactory("Posts");
 
    // Start deployment, returning a promise that resolves to a contract object
    const posts = await Posts.deploy("Deploying posts");   
    console.log("Contract deployed to address:", posts.address);
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });