import React from "react";
import styles from '../styles/Protected.module.css'
import { useSession, getSession } from "next-auth/react"


export default function Protected() {
    const { data: session, status } = useSession()

    console.log(session);
    console.log(status);
    
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
      
    return(
        <div className={styles.container}>
            <h2 className={styles.title}>Protected Page</h2>
            <p className={styles.description}>
            You are Authenticated
            </p>
        </div>
    )
}
