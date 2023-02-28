import express from 'express';
import http from 'http';
import { AddressInfo } from 'net';
import { SSXServer, SSXExpressMiddleware } from '@spruceid/ssx-server';
import cors from 'cors';

const app = express();

const ssx = new SSXServer({
  signingKey: "SUPER SECRET",
});

app.use(cors({ credentials: true, origin: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(SSXExpressMiddleware(ssx));

app.get('/', (_req, res) => {
  res.send('SSX Server Online\n');
});

const server = http.createServer(app).listen({ host: '0.0.0.0', port: '5000' }, () => {
  const addressInfo = server.address() as AddressInfo;
  console.log(`Server ready at http://${addressInfo.address}:${addressInfo.port};`);
});
