import { middyfy } from '@libs/lambda';
import { DynamoDB } from 'aws-sdk';
import { requireAddressSchema, signOutSchema, signInSchema } from './schemas';
import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from './api-gateway';
import { SSXServer, SSXInfuraProviderNetworks, SSXRPCProviders } from '@spruceid/ssx-serverless';

const DYNAMODB_TABLE_NAME = 'SSX';
const dynamoDb = new DynamoDB.DocumentClient({
  region: process.env.DYNAMO_DB_REGION,
  endpoint: process.env.DYNAMO_DB_ENDPOINT,
  accessKeyId: process.env.DYNAMO_DB_ACCESS_KEY_ID,
  secretAccessKey: process.env.DYNAMO_DB_SECRET_ACCESS_KEY
});

const update = async <T>(key: any, value: any, opts?: Record<string, any>): Promise<T> => {
  const ddbParams = {
    TableName: DYNAMODB_TABLE_NAME,
    Item: { address: key, ...value },
  };
  return dynamoDb.put(ddbParams).promise()
    .then(result => result as T);
};

const retrieve = async <T>(key: any): Promise<T> => {
  const ddbGetParams = {
    TableName: DYNAMODB_TABLE_NAME,
    Key: { address: key }
  };
  return dynamoDb.get(ddbGetParams).promise()
    .then(({ Item }) => Item as T)
    .catch(e => e?.message || "Unable to retrieve session.");
};

const create = async <T>(value: any): Promise<T> => {
  const ddbParams = {
    TableName: DYNAMODB_TABLE_NAME,
    Item: value,
  };
  return dynamoDb.put(ddbParams).promise()
    .then(result => result as T);
};

const _delete = async <T>(key: any): Promise<T> => {
  const ddbParams = {
    TableName: DYNAMODB_TABLE_NAME,
    Key: { address: key },
  };
  return dynamoDb.delete(ddbParams).promise() as T;
};

const ssx = new SSXServer({
  daoLogin: true,
  providers: {
    rpc: {
      service: SSXRPCProviders.SSXInfuraProvider,
      apiKey: process.env.INFURA_ID,
      network: SSXInfuraProviderNetworks.GOERLI,
    }
  }
}, {
  create,
  retrieve,
  update,
  delete: _delete,
});

const getNonce: ValidatedEventAPIGatewayProxyEvent<typeof requireAddressSchema> = async (event): Promise<any> => {
  return await ssx.getNonce({ sessionKey: event.queryStringParameters?.address })
    .then(({ nonce }) => nonce)
    .catch(error => formatJSONResponse(500, { error }));
};

const signIn: ValidatedEventAPIGatewayProxyEvent<typeof signInSchema> = async (event): Promise<any> => {
  return await ssx.signIn(
    event.body.siwe,
    event.body.signature,
    event.body.walletAddress,
    {
      daoLogin: true,
      resolveEnsDomain: true,
      resolveEnsAvatar: true,
    }
  )
    .catch(error => formatJSONResponse(500, { error }));
};

export const signOut: ValidatedEventAPIGatewayProxyEvent<typeof signOutSchema> = async (event): Promise<any> => {
  return await ssx.signOut(event.body.walletAddress)
    .catch(error => formatJSONResponse(500, { error }));
};

export const me: ValidatedEventAPIGatewayProxyEvent<typeof requireAddressSchema> = async (event): Promise<any> => {
  return await ssx.me(event.body.address)
    .catch(error => formatJSONResponse(500, { error }));
};

export const _getNonce = middyfy(getNonce);
export const _signIn = middyfy(signIn);
export const _signOut = middyfy(signOut);
export const _me = middyfy(me);