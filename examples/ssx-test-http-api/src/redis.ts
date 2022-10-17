import http, { IncomingMessage, ServerResponse } from "http";
import dotenv from "dotenv";
import { createClient } from "redis";
import { utils } from "ethers";
import {
  SSXServer,
  SSXHttpMiddleware,
  SSXRPCProviders,
  SSXInfuraProviderNetworks,
} from "@spruceid/ssx-server";

dotenv.config();

// setup redis client
const redisClient = createClient({
  legacyMode: true,
  url: process.env.REDIS_URL,
});

// connect to redis
redisClient.connect();
redisClient.on("error", (err) => {
  console.error("Redis error: ", err);
});
redisClient.on("connect", () => {
  console.log("Redis connected!");
});

const ssx = new SSXServer({
  signingKey: process.env.SSX_SIGNING_KEY,
  providers: {
    rpc: {
      service: SSXRPCProviders.SSXInfuraProvider,
      network: SSXInfuraProviderNetworks.MAINNET,
      apiKey: process.env.INFURA_API_KEY ?? "",
    },
    sessionConfig: {
      store: (session) => {
        const redisStore = require("connect-redis")(session);
        return new redisStore({
          client: redisClient,
        });
      },
    },
  },
});

const port = process.env.PORT || 3001;

const cors = (req: IncomingMessage, res: ServerResponse) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || '*');
  res.setHeader("Access-Control-Max-Age", "2592000");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, Referer, User-Agent"
  );

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return true;
  }
  return false;
};

// example function: get user data from rpc node
const getDataFromNode = async (address: string | undefined) => {
  if (!address) {
    return {};
  }
  const balanceRaw = await ssx.provider.getBalance(address);
  const balance = utils.formatEther(balanceRaw);
  const currentBlock = await ssx.provider.getBlockNumber();
  return { balance, currentBlock };
};

const processRequest = async (req: IncomingMessage, res: ServerResponse) => {
  if (req.url === "/userData") {
    if (!req.ssx.verified) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ success: false, message: "Unauthorized" }));
      return;
    }
    const data = await getDataFromNode(req.ssx.siwe?.address);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        success: true,
        userId: req.ssx.siwe?.address,
        message:
          "Some user data, retrieved from a blockchain node the server can access.",
        ...data,
      })
    );
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Not Found" }));
  }
};

// create instance of middleware
const ssxMiddleware = SSXHttpMiddleware(ssx);

const requestListener = async (req: IncomingMessage, res: ServerResponse) => {
  const optionsOnly = cors(req, res);
  if (optionsOnly) {
    return;
  }
  await ssxMiddleware()(req, res);
  if (res.headersSent) {
    return;
  }
  await processRequest(req, res);
};


// create http server
const server = http.createServer(requestListener);
server.listen(port);
console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
