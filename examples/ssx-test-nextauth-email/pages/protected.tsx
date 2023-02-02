import React from "react";
import styles from '../styles/Protected.module.css'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useSSX } from "@spruceid/ssx-react";


export default function Protected() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { ssx, ssxLoaded } = useSSX();

    const linkAccount = async () => {
        const response: any = await ssx?.signIn();
        fetch(`/api/auth/linkWeb3Account?address=${response.address}`)
            .then(console.log)
    }

    const unlinkAccount = async () => {
        fetch(`/api/auth/unlinkWeb3Account`)
            .then(console.log)
    }


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
                You are Authenticated as <br />
                {session?.user?.id}
            </p>
            <button onClick={signOut} disabled={!ssxLoaded}>Log Out</button>
            <button onClick={linkAccount} disabled={!ssxLoaded}>Link</button>
            <button onClick={unlinkAccount} disabled={!ssxLoaded}>Unlink</button>
        </div>
    )
}
