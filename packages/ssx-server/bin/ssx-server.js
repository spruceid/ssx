#!/usr/bin/env node

'use strict';

const config = require('rc')('ssx', {
  signingKey: '',
  providers: {
    rpc: {
      service: 'infura',
      network: 'homestead',
      apiKey: ''
    },
    metrics: {
      service: 'ssx',
      apiKey: ''
    },
  },
  listenPort: '8443',
  accessControlAllowOrigin: 'http://localhost:3000'
});

const { SSXServer } = require('../dist/server');
const { SSXExpressMiddleware } = require('../dist/middlewares/express');
const ssxServer = new SSXServer(config);
const expressApp = require('express')();

ssxServer.on('ssx-login', console.log);

expressApp.use(require('cors')({
  origin: config.accessControlAllowOrigin,
  credentials: true
}));
expressApp.use(SSXExpressMiddleware(ssxServer));
expressApp.listen(parseInt(config.listenPort));

