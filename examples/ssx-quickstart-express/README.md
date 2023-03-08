# ssx-quickstart-express
## Overview
This is a simple example on how to setup a SSX Server with Express.js. For a step by step guide head to
https://docs.ssx.id/ssx-server-quickstart.

## Running
Prepare by creating and editing the secrets in the `.env` file. You can use the `.env.example` as a template.
```bash
cp .env.example .env
```

To run the example, first install the dependencies and then start the server.
```bash
yarn && yarn start
```

The ssx-test-dapp is compatible with this example and is a good interface to test it. Note that some functionalities
might need extra configuration in order to properly work.
