# SSX Serverless - AWS Node.js Typescript + DynamoDB

## Setup

### Install dependencies
```bash
yarn
# OR
npm i
```

### Fill the .env file
```bash
cp .env.example .env
# fill the variables
```

### Install `serverless` globally
```bash
npm install --global serverless
```

# Run DynamoDB 

## **Using** Docker

```bash
docker-compose up -d dynamo
sls dynamodb start --migrate
```

## Or **without** Docker

Make sure you have java installed
```bash
sudo apt update
sudo apt install default-jdk default-jre
```

Change `serverless.ts` properties on line 52 (docker: true) and line 58 (noStart: true) to **false**.
```bash
sls dynamodb install
sls dynamodb start --migrate
```

# Run the functions locally
```bash
sls offline
```

# Testing

You can test this API using the [ssx-test-dapp](../ssx-test-dapp/README.md)! 

1. Follow the ssx-test-dapp instructions to run the frontend;
2. On the frontend, click on *Select Preference(s)* and enable *Server*;
3. Set the *Host* field to `http://localhost:3001/dev`;
4. Sign-In with Ethereum!

# Endpoints

Variables:

- ${ADDRESS}: user address
- ${WALLET_ADDRESS}: user address without delegation
- ${SIWE_MESSAGE}: the message that can be obtained by SiweMessage.prepareMessage()
- ${SIGNATURE}: the signature of the siwe message

### GET `/dev/ssx-nonce`

```bash
curl --location --request GET "http://localhost:3001/dev/ssx-nonce?address=${ADDRESS}&walletAddress=${WALLET_ADDRESS}"
```

Returns `200 Ok` on success, and a string with the nonce.

### POST `/dev/ssx-login`

```bash
curl --location --request POST "http://localhost:3001/dev/ssx-login" \
--header 'Content-Type: application/json' \
--data-raw '{
    "siwe": "${SIWE_MESSAGE}",
    "signature": "${SIGNATURE}",
    "address": "${ADDRESS}",
    "walletAddress": "${WALLET_ADDRESS}"
}'
```

Returns `200 Ok` on success, and the body:
```json
{
    "ens": { // empty object if no ENS configuration set
      "ensName": "ensName",
      "ensAvatarUrl": "ensAvatarUrl" // or undefined
    },
    "daoLogin": true, //or false
    "signature": "${SIGNATURE}",
    "siweMessage": "${SIWE_MESSAGE}", // as an object
}
```

### POST `/dev/ssx-logout`

```bash
curl --location --request POST "http://localhost:3001/dev/ssx-logout" \
--header 'Content-Type: application/json' \
--data-raw '{ "walletAddress": "${walletAddress}" }'
```
Returns `200 Ok` on success, and the body:

```json
{}
```

### GET `/dev/ssx-me`

```bash
curl --location --request GET "http://localhost:3001/dev/ssx-nonce?address=${WALLET_ADDRESS}"
```
Returns `200 Ok` on success, and the body:

```json
{
  "success": true //session is active ? true : false
}
```