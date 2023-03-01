import React from "react";
import { signOut, useSession } from 'next-auth/react';
import { useSSX } from "@spruceid/ssx-react";
import Header from "../components/Header";
import Title from "../components/Title";

export default function Protected() {
    const { data: session, status } = useSession();
    const { ssx, ssxLoaded } = useSSX();

    const reloadSession = () => {
        const event = new Event("visibilitychange");
        document.dispatchEvent(event);
    };

    const linkAccount = async () => {
        const response: any = await ssx?.signIn();
        fetch(`/api/auth/linkWeb3Account?address=${response.address}&chainId=${response.chainId}`)
            .then(() => {
                const rect = document.getElementById('pageSubtitle')?.getClientRects()[0];
                if (rect) {
                    window.explode(rect);
                }
                reloadSession();
            })
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
        return (
            <div className='App'>
                <Header />
                <Title
                    title='Protected Page'
                    subtitle='Loading...'
                />
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className='App'>
                <Header />
                <Title
                    title='Protected Page'
                    subtitle='This page is only accessible to authenticated users.'
                />
            </div>
        )
    }

    return (
        <div className='App'>
            <Header connectButton />
            <Title
                title='Protected Page'
                subtitle={
                    <div id='pageSubtitle'>
                        You are signed in as: email: {session?.user?.email}<br />
                        Linked Ethereum address: {session?.user?.web3Address || 'none'}
                    </div>
                }
            />

            <div className='Content'>
                <div className='Content-container'>
                    {
                        session?.user.web3Address ?
                            <button
                                className='Button'
                                onClick={unlinkAccount}
                                disabled={!ssxLoaded}
                            >
                                UNLINK YOUR ETHEREUM ACCOUNT
                            </button> :
                            <button
                                className='Button'
                                onClick={linkAccount}
                                disabled={!ssxLoaded}
                            >
                                LINK AN ETHEREUM ACCOUNT
                            </button>
                    }
                    <button
                        className='Button'
                        onClick={signOutAccount}
                        disabled={!ssxLoaded}
                    >
                        LOG OUT
                    </button>
                </div>
            </div>
        </div>
    )
}
