# SSX Examples
## Overview
This directory contains examples of how to use the various packages in the SSX Monorepo. The examples can be run standalone or together.

Frontend examples include 
- `ssx-test-app`
- `ssx-test-next`
- `ssx-test-sveltekit`

Backend examples include
- `ssx-test-express-api`
- `ssx-test-next`
- `ssx-test-sveltekit`


## Running the examples
To run the examples, you'll need to build the packages first. The best way to do that is in the root of the repo:
```sh
yarn
```

Then, you can run ssx-test-app and ssx-test-express-api:
```sh
# From the root of the repo
yarn run-examples
# OR
yarn test-app start
yarn express-api start
```
