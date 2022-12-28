import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import Head from 'next/head';
import type { NextPage } from 'next';
import { useSSX } from "@spruceid/ssx-react";
import styles from '../styles/Home.module.css';


const Home: NextPage = () => {
  const { ssx, ssxLoaded } = useSSX();
  const [address, setAddress] = useState<string>();

  const handleSignIn = async () => {
    await ssx?.signIn();
    setAddress(ssx?.address);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>RainbowKit App</title>
        <meta
          name="description"
          content="Generated by @rainbow-me/create-rainbowkit"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ display: "flex", justifyContent: "end" }}>
        <ConnectButton />
      </div>
      <main className={styles.main}>

        <h1 className={styles.title}>
          Welcome to <a href="">RainbowKit</a> + <a href="">wagmi</a> +{' '}
          <a href="https://docs.ssx.id/">SSX</a> + <a href="https://nextjs.org">Next.js</a> + <a href="https://next-auth.js.org/">NextAuth.js!</a>
        </h1>

        <p className={styles.description}>
          Sign-in with Ethereum powered by SSX
          <br/>
          <button onClick={handleSignIn} disabled={!ssxLoaded}>Sign Message</button>
        </p>
        {
          address && 
          <p className={styles.description}>
            Address: <code>{address}</code>
          </p>
        }
      </main>

      <footer className={styles.footer}>
        <a href="https://rainbow.me" target="_blank" rel="noopener noreferrer">
          Made with ❤️ by your frens at 🌈
        </a>
      </footer>
    </div>
  );
};

export default Home;