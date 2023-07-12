# SSX Client SDK

## Quick Start

You can add SSX to your app using your favorite package manager.

```bash
yarn add @spruceid/ssx
# or
npm install @spruceid/ssx
# or
pnpm add @spruceid/ssx
```

and then you can use it in your app.

```js
import { SSX } from "@spruceid/ssx";

const buttonHandler = async () => {
  const ssx = new SSX();
  const session = await ssx.signIn();
  const address = ssx.address();
};
```

## Documentation

For full documentation, see the [SSX Docs](https://docs.ssx.id)
