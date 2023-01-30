import { useState } from "react";
import logo from './logo.svg';
import { SSX } from '@spruceid/ssx';
import './App.css';
import getSSXConfig from './ssx.config';
import AccountInfo from "./components/AccountInfo";
import { ethers } from "ethers"
import Login from "./components/Login";
import NewPost from "./components/NewPost";
import Post from "./interfaces/iPost"
import Feed from "./components/Feed";


const App = () => {

  const [ssxProvider, setSSX] = useState<SSX | null>(null);
  const API_KEY = process.env.REACT_APP_API_KEY;
  const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY as any;
  const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS as any;
  const contract = require("./artifacts/contracts/Posts.sol/Posts.json");
  const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", API_KEY);
  const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
  const PostsContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
  const [posts, setPosts] = useState(['okay', 'nice'])


  const getPosts = async () => {
    const prevPosts: Post[] = await PostsContract.getAllPosts()
      console.log(prevPosts)
  }

  getPosts()
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
        <NewPost contract={PostsContract} ssxProvider={ssxProvider} posts={posts} setPosts={setPosts}></NewPost>
        </> :
        <div></div>          
        }
      </div>
        <Feed posts={posts}></Feed>
    </div>
  );
}

export default App;