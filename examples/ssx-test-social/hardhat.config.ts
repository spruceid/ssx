/**
* @type import('hardhat/config').HardhatUserConfig
*/

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY as any;
const API_URL = process.env.REACT_APP_API_URL;

module.exports = {
   solidity: "0.8.0",
   defaultNetwork: "goerli",
   networks: {
      hardhat: {},
      goerli: {
         url: API_URL,
         accounts: [`0x${PRIVATE_KEY}`]
      }
   },
}