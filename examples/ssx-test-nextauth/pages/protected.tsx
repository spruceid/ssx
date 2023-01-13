import React from "react";
import styles from '../styles/Protected.module.css'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useSSX } from "@spruceid/ssx-react";


export default function Protected() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { ssx, ssxLoaded } = useSSX();

    const signOut = async () => {
        await ssx?.signOut();
        router.push('/')
    }
    

    if (status === "loading") {
        <div className={styles.container}>
            <h2 className={styles.title}>Protected Page</h2>
            <p className={styles.description}>Loading</p>
        </div>
      }
    
      if (status === "unauthenticated") {
         return (<div className={styles.container}>
            <h2 className={styles.title}>Protected Page</h2>
            <p className={styles.description}>
            This page is only accessible to authenticated users.
            </p>
        </div>)
      }
      
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Protected Page</h2>
            <p className={styles.description}>
            You are Authenticated as <br/>
            {session?.user?.name}
            </p>
            <button onClick={signOut} disabled={!ssxLoaded}>Log Out</button>
        </div>
    )
}
