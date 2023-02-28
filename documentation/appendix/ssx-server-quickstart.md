---
description: This guide will help you quickly create an SSX Server powered by Express.js
---

# SSX Server Quickstart

## Overview

SSX Server enables you to have sessions for each user, ensure that generated nonces belong to the same session, provide validation when requests are made, and more.

We have a few examples to get you up and running, including a lightweight Express.js example [here](https://github.com/spruceid/ssx/tree/main/examples/ssx-quickstart-express).

{% embed url="https://github.com/spruceid/ssx/tree/main/examples/ssx-quickstart-express" %}

## Creating a Basic Express.js Server&#x20;

Start by creating a new `JavaScript` project and running `init` with your preferred package manager. In this guide, we'll be using `yarn`:

```
yarn init
```

After that, go into your new project folder and do the following:

* Create a folder called `src/` (if on a UNIX-based OS run `mkdir src`)
* Create a file under `src/` called `index.ts` and add the following:

<pre class="language-typescript"><code class="lang-typescript">/* src/index.ts */

<strong>import express from 'express';
</strong><strong>import dotenv from 'dotenv';
</strong>import cors from 'cors';

dotenv.config();
const PORT = process.env.PORT || '4000';

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('SSX Server Online\n');
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});


</code></pre>

To run this and prepare it to work with `ssx` run the following commands to install some dependencies:

* `yarn add -D typescript @types/cors @types/node @types/express ts-node`
* `yarn add @spruceid/ssx-server express cors dotenv`

Head to your `package.json` located at the root of your project and add the following:

```diff
...
  "license": "MIT",
+ "scripts": {
+   "start": "ts-node src/index"
+ },
  "devDependencies": {
...
```

You can now run `yarn start` and have a fully functional `express` server. To test it, run `curl localhost:4000` at your terminal, that should output: `UP`.

Now that you have the basic setup, adding `ssx` can be done with just one extra step, head to `src/index.ts` and add the following:

```diff
/* src/index.ts */

import express from 'express';
import dotenv from 'dotenv';
+ import { SSXServer, SSXExpressMiddleware } from '@spruceid/ssx-server';
import cors from 'cors';

dotenv.config();
const app = express();

+ const ssx = new SSXServer({
+   signingKey: process.env.SSX_SECRET,
+ });

const PORT = process.env.PORT || '4000';

app.use(cors({ credentials: true, origin: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
+ app.use(SSXExpressMiddleware(ssx));

app.get('/', (_req, res) => {
  res.send('SSX Server Online\n');
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});


```

The creation of a configuration file will also be necessary. To do that, create in the project's root folder a file named `.env` , and in that file, add the following:

```
SSX_SECRET=
```

{% hint style="warning" %}
Make sure to change that value to avoid using any default value.&#x20;
{% endhint %}

And that's it! You can stop the server (if you were still running it) and re-launch it.&#x20;

Now you have a `SSX Server` powered by `Express.js`. To test it, you can run any of the examples available in [the ssx monorepo](https://github.com/spruceid/ssx/tree/main/examples) and link to this API.

If you want to test it, you can also run the following command in your terminal to get a 16-character long nonce: `curl localhost:4000/ssx-nonce`
