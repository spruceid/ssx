---
description: SSX support for Auth.js
---

# Using SSX with Auth.js

## Overview

In early 2023, the team behind NextAuth introduced Auth.js as a new, even more extensible authentication framework.&#x20;

{% embed url="https://authjs.dev/" %}

Unlike NextAuth, which can only be used with Next, Auth.js allows developers to build bindings for any frontend framework using one backend for authorization and authentication. SSX currently has support for Auth.js in the following ways:

## @auth/nextjs

The Auth packages for the Next.js client and server are still a work in progress. We are keeping a close eye on any new developments. For now, if your project uses a Next frontend, you can follow the tutorial here[using-ssx-with-nextauth.md](../appendix/using-ssx-with-nextauth.md "mention").&#x20;

## @auth/sveltekit

The first binding that Auth.js offers is sveltekit. Auth.js provides an example application [`sveltekit-auth-example`](https://github.com/nextauthjs/sveltekit-auth-example) that demonstrates the functionality of the authjs/sveltekit package with a simple sign-in/sign-out interface and a protected page. In this guide, we extend the example provided by Auth.js to include the option to sign in with Ethereum using an SSX Credentials provider. You can see the full implementation here:[`ssx-test-sveltekit-auth`](https://github.com/spruceid/ssx/tree/main/examples/ssx-test-sveltekit-auth)

### Setting up

* To get started, clone the official `sveltekit-auth-example`:

```
git clone https://github.com/nextauthjs/sveltekit-auth-example.git
```

* Navigate to the sveltekit-auth-example directory and save the required ssx dependencies by typing the following in your terminal:

```
yarn add @spruceid/ssx @spruceid/ssx-authjs @spruceid/ssx-server siwe
```

* Create a .env file with `cp .env.example .env` then add and provide a value for `AUTH_SECRET` using the instructions provided in `.env.example`
*   Add `process.env` to the config in `vite.config.js` as follows:\


    ```javascript
      define: {
        'process.env': process.env
      }
    ```
* Finally, install all dependencies for the project with `yarn install`

### Add SvelteAuth API Route

We create an API route for `SvelteKitAuth` and configure it with SSX in `/hooks/server.ts`. SSX provides `credentials` and `authorize` functions that are configured to create a SvelteKitAuth Credentials provider.&#x20;

SSX also provides a `session` function, but it is likely you will want to modify the contents of the function to provide specific session data from the server to the frontend client.&#x20;

To get started from the example provided by auth.js, remove all the code in `/hooks/server.ts` and copy and paste the following:

```typescript
import { SvelteKitAuth } from "@auth/sveltekit"
import Credentials from "@auth/core/providers/credentials"
import { SSXServer } from "@spruceid/ssx-server";
import { generateNonce } from "siwe";
import { SSXSvelteAuth } from '@spruceid/ssx-authjs/server'

const ssx = new SSXServer({});

export const handle = (params) => {
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
```

### Using SSX Provider with NextAuth in your dapp

In our `+layout.svelte` page, we create an SSX instance to handle signing in. To do this in your own app, you can add the following imports and code inside of the script tags in `+layout.svelte`&#x20;

```typescript
<script lang="ts">
import { page } from "$app/stores"
import { SSX } from "@spruceid/ssx"
import { SSXSvelteAuthRouteConfig } from "@spruceid/ssx-authjs/client"

const { server } = SSXSvelteAuthRouteConfig();
const ssxConfig = {
  siweConfig: {
    domain: "localhost:5173",
  },
  providers: {
    server,
  },
}
const ssx = new SSX(ssxConfig);
  
const handleSignIn = () => {
  ssx.signIn();
}
</script>
```

Then, **replace** this line&#x20;

<pre class="language-html"><code class="lang-html"><a data-footnote-ref href="#user-content-fn-1">&#x3C;a href="/auth/signin" class="buttonPrimary" data-sveltekit-preload-data="off">Sign in&#x3C;/a></a>
</code></pre>

with a button that uses the SSX sign-in function:

```html
<button on:click={handleSignIn} class="buttonPrimary" data-sveltekit-preload-data="off">Sign-in</button>
```

### Putting it all together

At this point, your example app should work! Launch the app by running `yarn run dev`  in your terminal and opening your browser to [http://localhost:5173/](http://localhost:5173/). \


\


[^1]: ```html
    <a href="/auth/signin" class="buttonPrimary" data-sveltekit-preload-data="off">Sign in</a>
    ```
