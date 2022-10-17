# `ssx-gnosis-extension` is a SSX extension that enables Gnosis Delegation History

This package will check for delegators of an address after the wallet is connected
and before asking for the Sign-In with Ethereum message will display a modal with
the possible addresses to Sign-In as, being that the first option will always be
the wallet address.

## How to use it

Install it:

```bash
npm i @spruceid/ssx-gnosis-extension
# or
yarn add @spruceid/ssx-gnosis-extension
```

Currently, this package is bundled as part of the `ssx-sdk` package, so you do not need to import it separately. In order to enable it, `enableDaoLogin` must be set to true in the SSX constructor. To learn more about DAO Login, see the [SSX SDK Docs](https://docs.ssx.id/configuring-ssx#enabling-dao-login).

```javascript
import { SSX } from '@spruceid/ssx';

const loginButton = () => {
  const ssx = new SSX({
    enableDaoLogin: true,
  });

  await ssx.signIn();
}
```
