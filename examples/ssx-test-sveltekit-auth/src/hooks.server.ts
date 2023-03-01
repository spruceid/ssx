import { SvelteKitAuth } from "@auth/sveltekit"
import Credentials from "@auth/core/providers/credentials"
import { SSXServer } from "@spruceid/ssx-server";
import { generateNonce } from "siwe";
//import { SSXSvelteAuth } from '@spruceid/ssx-authjs/server'
import { onMount } from "svelte";

const ssx = new SSXServer({});

export const handle = (params) => {

  let SSXSvelteAuth; 
  onMount(async () => {
		let module = await import('@spruceid/ssx-authjs/server');
		SSXSvelteAuth=module.SSXSvelteAuth
	});
  if (SSXSvelteAuth) {
    const { credentials, authorize } = SSXSvelteAuth(params.event.cookies, ssx);

    if (params.event.url.pathname === "/ssx-nonce") {
      const nonce = generateNonce();
      params.event.cookies.set('nonce', nonce, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // one week
      });
      return new Response(nonce, { status: 200, });
    }
  
    return SvelteKitAuth({
      providers: [
        Credentials({
          credentials,
          authorize,
        }
        )
      ],
    })(params);
  }
}