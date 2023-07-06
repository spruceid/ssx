# SSX Client SDK

## Quick Start

You can add SSX to your app using your favorite package manager.

```bash
yarn add ssx-sdk
```

and then you can use it in your app.

```js
import { SSX } from "ssx-sdk";

const buttonHandler = async () => {
  const ssx = new SSX();
  await ssx.signIn();
  const address = await ssx.address();
};
```

## Documentation

For full documentation, see the [SSX SDK Docs](https://docs.ssx.id)
