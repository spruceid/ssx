/**
 * Only localhost:{3000,3010,4000,4010,4361,9080} are allowed to use the provided Infura ID
 */
const PORT = 4361;

import { config } from 'dotenv';
import Express from 'express';
import Session from 'express-session';
import fs from 'fs';
import Helmet from 'helmet';
import Morgan from 'morgan';
import Path from 'path';
import FileStore from 'session-file-store';
import { SSXServer, SSXExpressMiddleware, SSXInfuraProviderNetworks, SSXRPCProviders, } from '@spruceid/ssx-server';

const FileStoreStore = FileStore(Session);

config();

if (!process.env.SSX_SIGNING_KEY) {
    setTimeout(
        () =>
            console.log(
                '\n\n\n\nProject running with default values!\n\n\n\n',
                'To get rid of this message please define SSX_SIGNING_KEY in a .env file.\n\n',
            ),
        5000,
    );
}

const app = Express();

// Setup ssx instance
const ssx = new SSXServer({
    signingKey: process.env.SSX_SIGNING_KEY,
    providers: {
        rpc: {
            service: SSXRPCProviders.SSXInfuraProvider,
            network: SSXInfuraProviderNetworks.MAINNET,
            apiKey: process.env.INFURA_API_KEY ?? "",
        },
        sessionConfig: {
            store: () => {
                return new FileStoreStore({
                    path: Path.resolve(__dirname, '../db/sessions'),
                });
            }
        },
    },
});

/**
 * CSP Policies
 */
app.use(
    Helmet({
        contentSecurityPolicy: false,
    }),
);
app.use(Express.json({ limit: 43610 }));
app.use(Express.urlencoded({ extended: true }));
app.use(Morgan('combined'));
// SSX Middleware
app.use(SSXExpressMiddleware(ssx));
app.use(Express.static(Path.resolve(__dirname, '../public')));


app.get('/api/me', async (req, res) => {
    if (!req.ssx.verified) {
        res.status(401).json({ message: 'You have to first sign_in' });
        return;
    }
    res.status(200)
        .json({
            text: getText(req.ssx.siwe.address),
            address: req.ssx.siwe.address,
        })
        .end();
});

app.put('/api/save', async (req, res) => {
    if (!req.ssx.verified) {
        res.status(401).json({ message: 'You have to first sign_in' });
        return;
    }

    await fs.readdir(Path.resolve(__dirname, `../db`), (err, files) => {
        if (files.length === 1000001) {
            res.status(500).json({ message: 'File limit reached!' });
            return;
        }
    });

    updateText(req.body.text, req.session.siwe.address);
    res.status(204).send().end();
});

app.listen(PORT, () => {
    setTimeout(
        () => console.log(`Listening at port ${PORT}, visit http://localhost:${PORT}/`),
        5000,
    );
}).on('error', console.error);

const updateText = (text: string, address: string) =>
    fs.writeFileSync(Path.resolve(__dirname, `../db/${address}.txt`), text, { flag: 'w' });

const getText = (address: string) => {
    try {
        return fs.readFileSync(Path.resolve(__dirname, `../db/${address}.txt`), 'utf-8');
    } catch (e) {
        return '';
    }
};
