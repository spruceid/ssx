import express from 'express';
import dotenv from 'dotenv';
import { SSXServer, SSXExpressMiddleware } from '@spruceid/ssx-server';
import cors from 'cors';

dotenv.config();
const app = express();

const ssx = new SSXServer({
  signingKey: process.env.SSX_SECRET,
});

const PORT = process.env.PORT || '4000';

app.use(cors({ credentials: true, origin: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(SSXExpressMiddleware(ssx));

app.get('/', (_req, res) => {
  res.send('SSX Server Online\n');
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
