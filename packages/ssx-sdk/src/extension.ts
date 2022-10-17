import { ssxSession } from '@spruceid/ssx-sdk-wasm';
import { SSXConnected } from './core';
import { SSXSession, SiweConfig } from './types';

/** Interface for an extension to SSX. */
export interface SSXExtension {
    /** [capgrok] Capability namespace. */
    namespace?: string,
    /** [capgrok] Default delegated actions in capability namespace. */
    defaultActions?(): Promise<string[]>,
    /** [capgrok] Delegated actions by target in capability namespace. */
    targetedActions?(): Promise<{ [target: string]: string[] }>,
    /** [capgrok] Extra metadata to help validate the capability. */
    extraFields?(): Promise<ExtraFields>,
    /** Hook to run after SSX has connected to the user's wallet.
     * This can return an object literal to override the session configuration before the user
     * signs in. */
    afterConnect?(ssx: SSXConnected): Promise<ConfigOverrides>;
    /** Hook to run after SSX has signed in. */
    afterSignIn?(session: SSXSession): Promise<void>,
}

export type ExtraFields = ssxSession.ExtraFields;

/** Overrides for the session configuration. */
export type ConfigOverrides = {
  siwe?: SiweConfig
};
