import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import type { NextPage } from 'next';
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import Head from 'next/head';
import {  useSigner, useSignMessage } from "wagmi";
import { SiweMessage } from "@spruceid/ssx-react";
import styles from '../styles/Home.module.css';


const Home: NextPage = () => {
  const [address, setAddress] = useState<string>();
  const { data: session, status } = useSession();
  const { signMessageAsync } = useSignMessage();
  const { data, isSuccess: providerLoaded } = (typeof window !==
    'undefined' &&
    useSigner()) || { data: undefined, isSuccess: false };

  const handleSignIn = async () => {
    try {
      // console.log(data)
      // ssx features
      const daoLogin = false;
      const resolveEns = false;
      const callbackUrl = "/protected";

      const message = new SiweMessage({
        domain: window?.location?.host,
        address: await data?.getAddress(),
        statement: "Sign in with Ethereum",
        uri: window?.location.origin,
        version: "1",
        chainId: (data as any)?.provider?.network?.chainId,
        nonce: await getCsrfToken(),
      });
      const signature = await signMessageAsync({ message: message.prepareMessage() });
      signIn("credentials", { message: message.prepareMessage() , redirect: false, signature, daoLogin, resolveEns, callbackUrl });
      setAddress(await data?.getAddress());
    } catch (error) {
      console.log(error)
      window.alert(error);
    }
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
          <a href="https://docs.ssx.id/">SIWE</a> + <a href="https://nextjs.org">Next.js</a> + <a href="https://next-auth.js.org/">NextAuth.js!</a>
        </h1>

        <p className={styles.description}>
          Sign-in with Ethereum powered by SSX
          <br/>
          {
          session?.user
          ? <button
              onClick={(e) => {
                e.preventDefault();
                signOut();
              }}
            >
            {session.user.name?.substring(0, 5)}...{session.user.name?.substring(session.user.name.length - 2, session.user.name.length)}
            </button>
          : <button onClick={handleSignIn}>Sign Message</button>

      }
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
