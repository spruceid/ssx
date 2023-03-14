# @spruceid/ssx-gnosis-extension

## 1.1.5

### Patch Changes

- c1f0720: This fixes the SSX instance freezing if multisig modal is closed during the sign-in process.
- ef51b85: This prevents failing the sign-in process if daoLogin is enabled and fails.
- 0274cdf: Updates the modal code to prevent it showing before it finishes loading. This change should prevent a flash in the modal
- Updated dependencies [94cee9c]
- Updated dependencies [7f0343b]
  - @spruceid/ssx-core@1.2.0

## 1.1.4

### Patch Changes

- 60dedab: Fixes some UI elements and update some classes to prevent external CSS.
- 63f70cf: `ssx-gnosis-extension` helps to enable the DAO Login functionality by creating a modal and enabling selectors for end users. Because the module fetches the list of delegates for the sole purpose of displaying a selection UX to the user, the selected option is not currently matched against the retrieved list of delegates. This important security check is performed in SSX Server via a call to SiweMessage.verify, and these modules were designed to work together. This change improves the experience for developers who want to use `ssx-gnosis-extension` standalone (that is, without SSX Server) by adding extra checks on the client side to help with UX. However, the server side MUST still check for delegate inclusion by using SiweMessage.verify or similar immediately after sign-in.

## 1.1.3

### Patch Changes

- Patch fix for build issue
- Updated dependencies
  - @spruceid/ssx-core@1.1.1

## 1.1.2

### Patch Changes

- Updated dependencies [6205fc4]
- Updated dependencies [6205fc4]
- Updated dependencies [24a7220]
  - @spruceid/ssx-core@1.1.0

## 1.1.1

### Patch Changes

- Updated dependencies [b25cbde]
  - @spruceid/ssx-core@1.0.1

## 1.1.0

### Minor Changes

- c989838: Refactor code to avoid duplication and improve performance.

  - Adds `@spruceid/ssx-core` as a dependency;
  - Adds types from `ssx-core` to all SSX related variables;
  - Optimizes `try/catch` blocks.

- Updated dependencies [c989838]
- Updated dependencies [83c314c]
  - @spruceid/ssx-core@1.0.0

## 1.0.0

### Major Changes

- f317c82: Public release of the SSX SDK
