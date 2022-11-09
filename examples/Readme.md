# SSX Examples
## Overview
This directory contains examples of how to use the various packages in the SSX Monorepo. The examples are can be run standalone or together.

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

Then, you can run the examples:
```sh
# From the root of the repo
yarn run-examples
# OR
yarn test-dapp start
yarn express-api start
```
