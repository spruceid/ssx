import WalletConnect from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import Mousetrap from 'mousetrap';
import { SSX } from '@spruceid/ssx';

declare global {
    interface Window {
        // ethereum: any;
        web3: unknown;
    }
}

const enum Providers {
    METAMASK = 'metamask',
    WALLET_CONNECT = 'walletconnect',
}

//eslint-disable-next-line
const metamask = window.ethereum;
let walletconnect: WalletConnect;

let metamaskButton: HTMLButtonElement;
let walletConnectButton: HTMLButtonElement;
let toggleSize: HTMLButtonElement;
let closeButton: HTMLButtonElement;
let disconnectButton: HTMLDivElement;
let saveButton: HTMLDivElement;
let notepad: HTMLTextAreaElement;
let unsaved: HTMLParagraphElement;
let ssx: SSX | undefined;

/**
 * We need these to remove/add the eventListeners
 */

const signIn = async (connector: Providers) => {
    let provider: ethers.providers.Web3Provider;

    switch (connector) {
        case Providers.METAMASK:
            provider = new ethers.providers.Web3Provider(metamask);
            break;
        case Providers.WALLET_CONNECT:
            // update to walletconnect v2
            walletconnect = new WalletConnect({
                infuraId: "8fcacee838e04f31b6ec145eb98879c8" || process.env.INFURA_API_KEY,
            });
            walletconnect.enable();
            provider = new ethers.providers.Web3Provider(walletconnect);
            break;
        default:
            throw new Error('Unknown connector');
    }

    ssx = new SSX({
        resolveEns: true,
        providers: {
            web3: { driver: provider },
            server: { host: "/" },
          },
        siweConfig: {
            domain: 'localhost:4361',
            statement: 'SIWE Notepad Example',
        },
    });

    try {
        let { address, ens } = await ssx.signIn();
        updateTitle(ens?.domain || address);

        const res = await fetch(`/api/me`);
        if (res.status === 200) {
            res.json().then(({ text, address, ens }) => {
                connectedState(text, address, ens);
                return;
            });
        } else {
            res.json().then((err) => {
                console.error(err);
            });
        }
    } catch (error) {
        console.error(error);
    }
};

const signOut = async () => {
    updateTitle('Untitled');
    updateNotepad('');
    await ssx?.signOut();
    return disconnectedState();
};

/**
 * Saves the current content of our notepad
 */
const save = async (e?: Mousetrap.ExtendedKeyboardEvent | MouseEvent) => {
    e?.preventDefault();
    const text = notepad.value;
    if (Buffer.byteLength(JSON.stringify({ text })) > 43610) {
        alert('Your message is too big.');
        return;
    }
    return fetch('/api/save', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
    }).then(() => blockSave());
};

document.addEventListener('DOMContentLoaded', () => {
    /**
     * Try to fetch user information and updates the state accordingly
     */
    fetch('/api/me', { credentials: 'include' }).then((res) => {
        if (res.status === 200) {
            res.json().then(({ text, address, ens }) => {
                connectedState(text, address, ens);
            });
        } else {
            /**
             * No session we need to enable signIn buttons
             */
            disconnectedState();
        }
    });

    /**
     * Bellow here are just helper functions to manage app state
     */
    metamaskButton = document.getElementById('metamask') as HTMLButtonElement;
    walletConnectButton = document.getElementById('walletconnect') as HTMLButtonElement;
    disconnectButton = document.getElementById('disconnectButton') as HTMLDivElement;
    toggleSize = document.getElementById('toggleSize') as HTMLButtonElement;
    saveButton = document.getElementById('saveButton') as HTMLDivElement;
    notepad = document.getElementById('notepad') as HTMLTextAreaElement;
    closeButton = document.getElementById('closeButton') as HTMLButtonElement;
    unsaved = document.getElementById('unsaved') as HTMLParagraphElement;
    /**
     * If we don't have metamask installed hide the button.
     */
    if (typeof metamask === undefined) {
        metamaskButton.classList.add('hidden');
    }

    toggleSize.addEventListener('click', maximize);
    disconnectButton.addEventListener('click', signOut);
    metamaskButton.addEventListener('click', () => signIn(Providers.METAMASK));
    walletConnectButton.addEventListener('click', () => signIn(Providers.WALLET_CONNECT));
    saveButton.addEventListener('click', save);
    notepad.addEventListener('input', enableSave);
});

const blockSave = () => {
    saveButton.removeEventListener('click', save);
    saveButton.setAttribute('disabled', 'true');
    updateUnsavedChanges('');
    window.onbeforeunload = null;
};

const enableSave = () => {
    saveButton.addEventListener('click', save);
    saveButton.removeAttribute('disabled');
    updateUnsavedChanges('- (***Unsaved Changes***)');
    window.onbeforeunload = () => '(***Unsaved Changes***)';
};

Mousetrap.bind('mod+s', save as any);

const connectedState = (text: string, address: string, ens: string) => {
    /**
     * Updates fields and buttons
     */
    metamaskButton.classList.add('hidden');
    walletConnectButton.classList.add('hidden');
    closeButton.addEventListener('click', signOut);
    closeButton.removeAttribute('disabled');
    saveButton.classList.remove('hidden');
    disconnectButton.classList.remove('hidden');
    if (text) {
        updateNotepad(text);
    }
    blockSave();
    updateTitle(ens ?? address);
};

const disconnectedState = () => {
    if (typeof metamask !== undefined) {
        metamaskButton.classList.remove('hidden');
    }
    walletConnectButton.classList.remove('hidden');
    closeButton.removeEventListener('click', signOut);
    closeButton.setAttribute('disabled', 'disabled');
    saveButton.classList.add('hidden');
    disconnectButton.classList.add('hidden');
};

const updateTitle = (text: string) => (document.getElementById('title').innerText = text);

const updateUnsavedChanges = (text: string) => (unsaved.innerText = text);

const updateNotepad = (text: string) => (notepad.value = text);

const maximize = () => {
    toggleSize.removeEventListener('click', maximize);
    toggleSize.addEventListener('click', restore);
    toggleSize.ariaLabel = 'Restore';
    notepad.style.width = '99.7vw';
    notepad.style.height = '91.7vh';
};

const restore = () => {
    toggleSize.removeEventListener('click', restore);
    toggleSize.addEventListener('click', maximize);
    toggleSize.ariaLabel = 'Maximize';
    notepad.style.width = '460px';
    notepad.style.height = '320px';
};
