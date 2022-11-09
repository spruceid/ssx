import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { utils } from 'ethers';
import { SSXServer, SSXExpressMiddleware, SSXRPCProviders, SSXInfuraProviderNetworks } from '@spruceid/ssx-server';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

const ssx = new SSXServer({
  signingKey: process.env.SSX_SIGNING_KEY,
  providers: {
    rpc: {
      service: SSXRPCProviders.SSXInfuraProvider,
      network: SSXInfuraProviderNetworks.GOERLI,
      apiKey: process.env.INFURA_API_KEY ?? "",
    },
    metrics: {
      service: 'ssx',
      apiKey: process.env.SSX_API_TOKEN ?? ""
    },
  },
  ens: {
    resolveEnsDomain: false,
    resolveEnsAvatar: false,
  }
});

app.use(cors({
  credentials: true,
  origin: true,
}));

app.use(SSXExpressMiddleware(ssx));

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/userdata', async (req: Request, res: Response) => {
  if (!req.ssx.verified) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const data = await getDataFromNode(req.ssx.siwe?.address);

  res.json({
    success: true,
    userId: req.ssx.siwe?.address,
    message: 'Some user data, retrieved from a blockchain node the server can access.',
    ...data,
  });
});

app.use((req, res) => {
  if (!res.headersSent) {
    res.status(404).json({ message: 'Invalid API route', success: false });
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

async function getDataFromNode(address: string | undefined) {
  if (!address) {
    return {};
  }
  const balanceRaw = await ssx.provider.getBalance(address);
  const balance = utils.formatEther(balanceRaw);
  const currentBlock = await ssx.provider.getBlockNumber();
  return { balance, currentBlock };
}
