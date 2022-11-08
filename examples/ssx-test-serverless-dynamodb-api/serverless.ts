import type { AWS } from '@serverless/typescript';

import getNonce from '@functions/ssx-nonce';
import signIn from '@functions/ssx-login';
import signOut from '@functions/ssx-logout';
import me from '@functions/ssx-me';

const serverlessConfiguration: AWS = {
  service: 'ssx-serverless-test',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dynamodb-local', 'serverless-offline'],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      DYNAMO_DB_REGION: '${env:DYNAMO_DB_REGION}',
      DYNAMO_DB_ENDPOINT: '${env:DYNAMO_DB_ENDPOINT}',
      DYNAMO_DB_ACCESS_KEY_ID: '${env:DYNAMO_DB_ACCESS_KEY_ID}',
      DYNAMO_DB_SECRET_ACCESS_KEY: '${env:DYNAMO_DB_SECRET_ACCESS_KEY}',
      INFURA_ID: '${env:INFURA_ID}'
    },
  },
  // import the function via paths
  functions: { getNonce, signIn, signOut, me },
  resources: {
    Resources: {
      SIWE: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "SSX",
          AttributeDefinitions: [
            { AttributeName: "address", AttributeType: "S" },
          ],
          KeySchema: [
            { AttributeName: "address", KeyType: "HASH" },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        }
      }
    }
  },
  package: { individually: true },
  custom: {
    dynamodb: {
      start: {
        docker: true,
        image: 'dynamo',
        port: 8000,
        inMemory: true,
        heapInitial: 200,
        heapMax: '1g',
        noStart: true,
        migrate: true,
        seed: true,
        convertEmptyValues: true,
      }
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    'serverless-offline': {
      httpPort: 3001
    }
  },
};

module.exports = serverlessConfiguration;
