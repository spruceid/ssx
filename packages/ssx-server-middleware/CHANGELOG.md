# @spruceid/ssx-server-middleware

## 1.1.0

### Minor Changes

- 94cee9c: This adds callbacks on ssx server middlewares routes. Usage example:

  ```js
  SSXExpressMiddleware(
    // same to SSXHttpMiddleware
    ssx,
    {
      login: {
        path: '/ssx-login',
        callback: (req: Request) => {
          console.log(`User ${req.body.address} successfully signed in`);
        },
      },
      logout: '/ssx-custom-logout',
    }
  );
  ```

### Patch Changes

- Updated dependencies [94cee9c]
- Updated dependencies [c1f0720]
- Updated dependencies [7f0343b]
- Updated dependencies [ef51b85]
- Updated dependencies [0274cdf]
  - @spruceid/ssx-core@1.2.0
  - @spruceid/ssx-gnosis-extension@1.1.5

## 1.0.2

### Patch Changes

- Fixing nonce bug documented here https://github.com/spruceid/ssx/issues/70
- Updated dependencies [60dedab]
- Updated dependencies [63f70cf]
  - @spruceid/ssx-gnosis-extension@1.1.4

## 1.0.1

### Patch Changes

- Updated dependencies
  - @spruceid/ssx-core@1.1.1
  - @spruceid/ssx-gnosis-extension@1.1.3

## 1.0.0

### Major Changes

- 6205fc4: Extracted middleware logic to new ssx-server-middleware package. Moved `SSXServer` class interface to `ssx-core` and passed around implementation

### Patch Changes

- Updated dependencies [6205fc4]
- Updated dependencies [6205fc4]
- Updated dependencies [24a7220]
  - @spruceid/ssx-core@1.1.0
  - @spruceid/ssx-gnosis-extension@1.1.2
