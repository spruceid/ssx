import React from "react";
import styles from '../styles/Protected.module.css'
import { signOut, useSession } from 'next-auth/react';
import { useSSX } from "@spruceid/ssx-react";


export default function Protected() {
    const { data: session, status } = useSession();
    const { ssx, ssxLoaded } = useSSX();

    const reloadSession = () => {
        const event = new Event("visibilitychange");
        document.dispatchEvent(event);
    };

    const linkAccount = async () => {
        const response: any = await ssx?.signIn();
        fetch(`/api/auth/linkWeb3Account?address=${response.address}`)
            .then(reloadSession)
    }

    const unlinkAccount = async () => {
        fetch(`/api/auth/unlinkWeb3Account`)
            .then(reloadSession)
    }

    const signOutAccount = async () => {
        try {
            await ssx?.signOut();
        } catch (e) { }
        signOut({
            callbackUrl: '/'
        });
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
                {session?.user?.id}<br />
                email: {session?.user?.email}<br />
                web3Address: {session?.user?.web3Address}
            </p>
            <button onClick={signOutAccount} disabled={!ssxLoaded}>Log Out</button>
            {
                session?.user.web3Address ?
                    <button onClick={unlinkAccount} disabled={!ssxLoaded}>Unlink</button> :
                    <button onClick={linkAccount} disabled={!ssxLoaded}>Link</button>
            }
        </div>
    )
}
