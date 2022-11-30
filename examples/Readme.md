# SSX Examples
## Overview
This directory contains examples of how to use the various packages in the SSX Monorepo. The examples can be run standalone or together.

Frontend examples include 
- `ssx-test-dapp`
- `ssx-test-react-dapp`

Backend examples include
- `ssx-test-express-api`
- `ssx-test-http-api`
- `ssx-test-serverless-dynamodb-api`


## Running the examples
To run the examples, you'll need to build the packages first. The best way to do that is in the root of the repo:
```sh
yarn ci
# OR
yarn && yarn build
```

Then, you can run ssx-test-dapp and ssx-test-express-api:
```sh
# From the root of the repo
yarn run-examples
# OR
yarn test-dapp start
yarn express-api start
```

The ssx-test-dapp is compatible with any example backend and is a good way to test them.
