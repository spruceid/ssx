[![codecov](https://codecov.io/gh/spruceid/ssx/branch/main/graph/badge.svg?token=JV205ZHO78)](https://codecov.io/gh/spruceid/ssx)

# SSX

SSX is a library that enables you to easily add user authentication, session management, and more to your app.

## Documentation

https://docs.ssx.id

## SDKs

- Client side under [`./packages/ssx-sdk`](./packages/ssx-sdk).
- Server side under [`./packages/ssx-server`](./packages/ssx-server).

## Useful Commands
> **⚠** This repository requires node >= 18.16.0

- `yarn` - Install dependencies and build packages
- `yarn build` - Build all packages and examples
- `yarn build:packages` - Build all packages
- `yarn build:examples` - Build all examples
- `yarn examples` - Concurrently run the `ssx-test-app` and `ssx-test-express-api` found in `./examples`
- `yarn test` - Run unit tests (Jest)
- `yarn test:e2e` - Run E2E tests (Cypress/Synpress)
- `yarn reset` - Remove all build artifacts and node_modules


## Docker

SSX ships with a [Docker Compose](https://docs.docker.com/compose/) configuration
for setting up a local development and testing environment with SSX server and
our example app. Make sure you have
[Docker and Compose installed](https://docs.docker.com/compose/install/), then
create a `.env` file in the project root:

```
ssx_listenPort=8443 # ssx server will be available on http://localhost:8443
ssx_signingKey= # session secret for ssx server
ssx_providers__metrics__apiKey= # ssx metrics api key https://app.ssx.id
ssx_providers__rpc__apiKey= # infura api key for wallet connect (optional)
```

Save your `.env` file and from the project root, run:

```
docker compose up
```

Docker will build containers for the SSX server and example app from the
working tree and start them both.

- Example app: http://localhost:3000
- SSX Server: http://localhost:8443
