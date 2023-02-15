# SSX NextAuth with Email Example

This is an example dapp for `ssx-react`. It's a Next.js app that implements a login flow with NextAuth.js, SSX and RainbowKit, but requires a user to first log in using their email.

- First a user signs in with an email
- Next, a user associates their Ethereum account to their login information
- Finally, they can use that associated Ethereum account to Sign-In with Ethereum

NextAuth.js is configured with [EmailProvider](https://next-auth.js.org/providers/email) and SSX ([CredentialsProvider](https://next-auth.js.org/configuration/providers/credentials)) as providers and [Prisma](https://next-auth.js.org/adapters/prisma) as an adapter to connect the dapp to a database. This example adds a web3Address (Ethereum Address) column to the User model (see [schema.prisma](prisma/schema.prisma)) and implements link and authentication logic based on the user's email and web3Address (see [SSXNextAuthWithEmailBackend.ts](components/SSXNextAuthWithEmailBackend.ts)).

## Getting Started
To run the app locally, do the following:

### Install dependencies
```bash
yarn
```

### Start SMTP Fake Server

This step starts a fake local SMTP server with a web client that allows access to the mailbox. This is not mandatory, but you will need to have an SMTP server available for the next steps.

To start the server run:

```bash
docker run -d -p 1080:1080 -p 1025:1025 --name mailcatcher schickling/mailcatcher
```

To check the mailbox head over to http://localhost:1080.

### Copy the file and fill the environment variables

```bash
cp .env.example .env
```

If you are using the fake SMTP server set EMAIL_SERVER=smtp://localhost:1025 and EMAIL_FROM can be any email. 
Otherwise set EMAIL_SERVER=smtp://user:password@host:port and EMAIL_FROM=configured email.

### Setup DB (SQLite)

This example uses SQLite for easy testing, but you can change the database at any time by changing the data source in [schema.prisma](prisma/schema.prisma). See the [Prisma Database Connectors](https://www.prisma.io/docs/concepts/database-connectors) for more information.

```bash
npx prisma migrate dev
npx prisma generate
```

> Warning: you must run `npx prisma generate` every time you reinstall your dependencies!

### Run

```bash
yarn dev
```

The dapp will be running at http://localhost:3000 by default.