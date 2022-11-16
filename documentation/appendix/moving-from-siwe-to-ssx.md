---
description: A tutorial on integrating SSX
---

# Moving From SIWE to SSX

## Overview

Sign-in with Ethereum is a great way to enable your users to authenticate using their Ethereum wallet. However, adding it you your application requires adding logic and endpoints for managing sessions, connecting to the Ethereum network, issuing nonces, and verifying signatures. Adding or extending functionality around sign-in (such as signing in on behalf of a Gnosis Safe) can also be tricky to figure out.

This is where SSX comes in! SSX is a library that makes it easy to add SIWE to your application. It handles all the logic and endpoints for you and allows you to easily extend it to add additional functionality such as signing in on behalf of a Gnosis Safe, resolving ENS names, and more.

This guide demonstrates how to add SSX to an application that is already using the SIWE library.

### Modifications

{% hint style="info" %}
`ssx-notepad` is a simple example dapp with a simple express backend that stores a note for an authenticated Ethereum user. It is based on the original [`siwe-notepad`](https://github.com/spruceid/siwe-notepad).
{% endhint %}

The completed version of the dapp with the modifications can be found here:&#x20;

{% embed url="https://github.com/spruceid/ssx-notepad" %}

To modify `ssx-notepad` to use SSX instead of SIWE the following files were changed:

* `src/providers.ts` - this file holds the frontend code including the wallet connection logic.
* `src/index.ts` - this file handles the backend logic including the endpoints for signing in and storing the note.

## Migration

### Change Overview

The migration from SIWE to SSX is fairly straightforward. The changes can be seen in [`ssx-notepad`](https://github.com/spruceid/ssx-notepad) which was forked from the [`siwe-notepad`](https://github.com/spruceid/siwe-notepad) example. The [main changes](https://github.com/spruceid/siwe-notepad/compare/main...spruceid:ssx-notepad:main) are:

* Add the `ssx` library to your frontend ([4575af9](https://github.com/spruceid/ssx-notepad/pull/1/commits/4575af935b43eb4c4edeb2bd715ed1d817e423a6)).
* Replace the wallet connection and signing logic with the `ssx` library ([391a90f](https://github.com/spruceid/ssx-notepad/pull/1/commits/391a90f1036bb214e16aa9070207ab673d400065)).
* Add the `ssx-server` library to your backend ([d484d0e](https://github.com/spruceid/ssx-notepad/pull/2/commits/d484d0ee483368eb611a2b84973b8d6ec520b37c)).
* Create and instantiate an `SSX` object and middleware ([a7ff4a5](https://github.com/spruceid/ssx-notepad/pull/2/commits/a7ff4a51a78ebae4832339e372a4bb23260ea345)).
* Point the frontend SSX client to your SSX backend ([301ca42](https://github.com/spruceid/ssx-notepad/pull/2/commits/301ca420132599527f131b0ed75048194fa9b300)).
* Use SSX for session authentication ([390a2ec](https://github.com/spruceid/ssx-notepad/pull/2/commits/390a2ecbfad844dbd76e7338a7536086da92435b)).
* Update/verify your API calls work with the session cookie.
* Remove the SIWE library and unused functions/endpoints.

### Frontend Changes

{% hint style="info" %}
You can follow along by forking or cloning [siwe-notepad](https://github.com/spruceid/siwe-notepad) and applying them yourself.  If cloning `siwe-notepad`, be sure to add [an .env](https://github.com/spruceid/ssx-notepad/blob/main/.env.example) file with an SSX Signing Key.
{% endhint %}

First, you'll need to install SSX and add it you your project:

<pre class="language-bash"><code class="lang-bash"><strong>cd siwe-notepad
</strong><strong>npm install @spruceid/ssx</strong></code></pre>

In `src/providers.ts`add the following:

```javascript
import { SSX } from "@spruceid/ssx";
```

Replace the wallet connection and signing logic with the `ssx` library (making sure to note the location by using the provided comments):&#x20;

```typescript
let ssx: SSX | undefined; // global/reusable scope

/** ...in the signIn function
/* walletconnect.enable();
/*   provider = new ethers.providers.Web3Provider(walletconnect);
/* }
/**/

ssx = new SSX({
  providers: {
    web3: { driver: provider },
  },
  siweConfig: {
    domain: "localhost:4361",
    statement: "SIWE Notepad Example",
  },
});

let { address, ens } = await ssx.signIn();

/** ...previous code
/* const [address] = await provider.listAccounts();
/**/
```

{% hint style="info" %}
If you are following by editing `siwe-notepad`, be sure to remove duplicate variables `address` and `ens`, as seen [in this change.](https://github.com/spruceid/siwe-notepad/commit/391a90f1036bb214e16aa9070207ab673d400065#diff-2b7ff992842c6f8113f826af7e81b310a87148e85eef65304868dfc91dad5febL59-L62)
{% endhint %}

Check that your application still works as expected. You will have two SIWE calls, the new one from SSX and the existing one.&#x20;

We will come back to the frontend to connect it and clean up after we add `ssx-server`.

### Backend Changes

Now, we'll add install and SSX to the backend server. First, install `ssx-server` via your terminal.

```bash
npm install @spruceid/ssx-server
```

In `src/index.ts`add the following (making sure to note the location by using the provided comments):

```typescript
import {
  SSXServer,
  SSXExpressMiddleware,
  SSXInfuraProviderNetworks, // optional enum import
  SSXRPCProviders, // optional enum import
} from "@spruceid/ssx-server";

/** SSX instantiated after env import
/* config();
/**/

const ssx = new SSXServer({
  signingKey: process.env.SSX_SIGNING_KEY, // you will need to add this to your .env
  providers: {
    // an RPC provider is optional here, as we are not resolving ens server side. But this is supported
    rpc: {
      service: SSXRPCProviders.SSXInfuraProvider,
      network: SSXInfuraProviderNetworks.MAINNET,
      apiKey: process.env.INFURA_API_KEY ?? "",
    },
    sessionConfig: {
      store: () => {
        // we use the existing configuration for session store, but pass it to SSX Server
        return new FileStoreStore({
          path: Path.resolve(__dirname, "../db/sessions"),
        });
      },
    },
  },
});

// Express Middleware: place after app = Express();
app.use(SSXExpressMiddleware(ssx));
```

{% hint style="info" %}
If following the `siwe-notepad` example,[ you can update the warning](https://github.com/spruceid/siwe-notepad/commit/67010242251a36943fcb0c20390dc9ee890c132d#diff-a2a171449d862fe29692ce031981047d7ab755ae7f84c707aef80701b3ea0c80L24) about required secrets.
{% endhint %}

Once SSX is live on the server, you can add it to your frontend by adding the `providers.server.host` field.&#x20;

Once this is done, you should be able to sign in and get a session cookie from the server using SIWE:

```diff
ssx = new SSX({
 providers: {
   web3: { driver: provider },
+  server: { host: "/" },   
 },
 siweConfig: {
   domain: "localhost:4361",
   statement: "SIWE Notepad Example",
 },
});
```

Now that SSX is installed, you can use it to protect express routes instead of `req.session.siwe:`

```diff
app.put('/api/save', async (req, res) => {
-   if (!req.session.siwe) {
+   if (!req.ssx.verified) {
       res.status(401).json({ message: 'You have to first sign_in' });
       return;
   }
```

### Cleanup and Testing

Once you've done the above steps, SSX is now installed for your dapp! After this you can do the following:

* Remove logic from the frontend that uses the old authentication. Verify that the session cookie is sent with your requests to the server. Test the dapp!
* Remove or deprecate old endpoints and logic using the previous SIWE method on your backend.
* Remove the `siwe` dependency.

#### Frontend Cleanup

If following along with `siwe-notepad`, remove this old code to get user data:

```typescript
    const [address] = await provider.listAccounts();
    if (!address) {
        throw new Error('Address not found.');
    }

    /**
     * Try to resolve address ENS and updates the title accordingly.
     */
    let ens: string;
    try {
        ens = await provider.lookupAddress(address);
    } catch (error) {
        console.error(error);
    }
```

And replace this code to login with only ssx

```diff
    let { address, ens } = await ssx.signIn();
+   updateTitle(ens?.domain || address);
+   const res = await fetch(`/api/me`);
-    fetch(`/api/sign_in`, {
-        method: 'POST',
-        body: JSON.stringify({ message, ens, signature }),
-        headers: { 'Content-Type': 'application/json' },
-        credentials: 'include',
-    }).then(async (res) => {
        if (res.status === 200) {
            res.json().then(({ text, address, ens }) => {
                connectedState(text, address, ens);
```

## Other SSX Features

SSX has a few great features like signing in on behalf of a Safe, resolving ENS on login, or accessing metrics. To learn more about enabling these features, check out the [SSX Docs.](https://docs.ssx.id/configuring-ssx)

### ENS Resolution

Adding a flag for ENS resolution will also provide an ENS domain and name if one is set for the account:

```diff
ssx = new SSX({
+ resolveEns: true,
  providers: {
    web3: { driver: provider },
  },
  siweConfig: {
    domain: "localhost:4361",
    statement: "SIWE Notepad Example",
  },
});
let { address, ens } = await ssx.signIn(); // this will now show if ens exists
```
