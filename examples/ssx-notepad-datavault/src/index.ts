import { config } from 'dotenv';
import Helmet from 'helmet';
import Express from 'express';
import Path from 'path';

config();

const app = Express();

app.use(
    Helmet({
        // contentSecurityPolicy: {
        //   directives: {
        //     "default-src": ["'self'"],
        //     "style-src": [
        //       "'self'",
        //       "'unsafe-inline'",
        //       "https://unpkg.com",
        //     ],
        //     "img-src": [
        //       "'self'",
        //       "data:",
        //     ],
        //     "font-src": [
        //       "'self'",
        //       "https://unpkg.com",
        //     ],
        //     "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://kepler.spruceid.xyz"],
        //     "connect-src": [
        //       "'self'",
        //       "https://kepler.spruceid.xyz",
        //       "https://kepler.spruceid.xyz/delegate",
        //       "wss://*.walletconnect.org",
        //       "https://*.walletconnect.org",
        //       "https://*.infura.io",
        //     ],
        //   },
        // },
        contentSecurityPolicy: false,
        referrerPolicy: { policy: "no-referrer-when-downgrade" },
      }),
);
app.use(Express.static(Path.resolve(__dirname, '../public')));

const PORT = process.env.PORT || 4361;

app
  .listen(PORT, () => {
    setTimeout(
      () => console.log(`Serving SSX Notepad at http://localhost:${PORT}`),
      5000
    );
  })
  .on('error', console.error);
