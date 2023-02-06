# SSX NextAuth with Email Example

This is an example dapp for ssx-react. It's a Next.js app that implements a login flow with SSX and Email. The user is allowed to sign in with email at any time, and with SSX if the email is linked to a web3 address. It was generated from create from [RainbowKit's Create Dapp template](https://www.rainbowkit.com/) and then modified to use ssx-react for signing in.

## Getting Started
To run the app locally, do the following:

### Install dependencies
```bash
yarn
```

### Copy the file and fill the environment variables

```bash
cp .env.example .env
```

Pay attention to the SMTP configuration (EMAIL_SERVER and EMAIL_FROM). 

### Setup DB (SQLite)

```bash
npx prisma migrate dev
npx prisma generate
```

> Warning: you must run `npx prisma generate` every time you reinstall your dependencies!

### Run

```bash
yarn dev
```