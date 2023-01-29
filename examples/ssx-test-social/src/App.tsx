import { useState } from "react";
import logo from './logo.svg';
import { SSX } from '@spruceid/ssx';
import './App.css';
import getSSXConfig from './ssx.config';
import AccountInfo from "./components/AccountInfo";
import { ethers } from "ethers"
import Login from "./components/Login";
import NewPost from "./components/NewPost";


function App() {

  const [ssxProvider, setSSX] = useState<SSX | null>(null);
  const API_KEY = process.env.REACT_APP_API_KEY;
  const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY as any;
  const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS as any;
  const contract = require("./artifacts/contracts/Posts.sol/Posts.json");
  const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", API_KEY);
  const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
  const PostsContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
  const [posts, setPosts] = useState([])


  return (
    <div className="App">
      <div className="App-header">
        <img
          src={logo}
          className="App-logo"
          alt="logo"
        />
        <span>SSX</span>
      </div>
      <Login ssxProvider={ssxProvider} setSSX={setSSX}></Login>
      <div className="newPost">
        {
        ssxProvider ? 
        <>
        <NewPost postsContract={PostsContract} setPosts={setPosts} posts={posts} ssxProvider={ssxProvider}></NewPost>
        </> :
        <div></div>          
        }
      </div>
    </div>
  );
}

export default App;