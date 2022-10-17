---
description: >-
  An overview of what happens when a user Sign-in with Ethereum when powered by
  SSX
---

# ❓ SSX: How It Works

## Overview

SSX is a library that enables you to easily integrate Sign-In with Ethereum (SIWE) for authenticating users, managing sessions, understanding user metrics, and more! We've made it simple to add SSX to both your frontend client app as well your backend server.

### SSX Client

When you install SSX, you have an easy way to add Sign-In with Ethereum to your front-end application. SSX has a few configuration options that enable your users to sign in with their externally owned waller or on behalf of a Gnosis Safe. Further configuration allows seamless communication with your backend server. But what happens in those few moments before their wallet pops up and after they sign the message? Continue below to find out!

### SSX Server&#x20;

When you have both SSX and SSX-Server there are a few key things that occur: SSX on the client reaches out to known endpoints provided by SSX-Server. It then uses data returned from the server in the signed message, to get a session, and in subsequent server requests.

How does this happen? SSX-Server provides your server with a few new endpoints:

* `/ssx-nonce`: This endpoint is called before a user is presented with a SIWE request. This nonce is added to the request to verify that it is the user signing, and not an attacker reusing a signature
* `/ssx-login`: This endpoint is called after a user completes the SIWE signature. This sends the signature to the server for verification and obtains a session cookie (`ssx-session`), which is used in subsequent requests to authenticate.
* `/ssx-logout`: This endpoint clears SSX session cookies, ending the authenticated session.

SSX-Server issues 1st-party cookies from your server that are then passed along with each request. These cookies can be signed by the server to prevent client-side tampering.

{% hint style="info" %}
Upon successful login, SSX-Server issues a session cookie, `ssx-session` that contains the signed SIWE message. SSX-Server then checks this cookie on each request and verifies the message. It then updates the `req.siwe` object with user-specific data that can be used in subsequent requests.
{% endhint %}

``

![An overview of the sign-in flow using SSX and SSX-Server](.gitbook/assets/ssx-overview-2.png)
