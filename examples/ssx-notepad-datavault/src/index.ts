
import { config } from 'dotenv';
import Express from 'express';
import Path from 'path';

config();

const app = Express();

app.use(Express.static(Path.resolve(__dirname, '../public')));

const PORT = process.env.PORT || 4361;

app.listen(PORT, () => {
    setTimeout(
        () => console.log(`Serving SSX Notepad at http://localhost:${PORT}`),
        5000,
    );
}).on('error', console.error);
