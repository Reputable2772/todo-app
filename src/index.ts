import express, { type Response } from 'express';
import cookieparser from 'cookie-parser';

import { opts, log } from './utils.js';
import getDb from './db.js';
import login from './routes/login.js';
import signup from './routes/signup.js';
import todosRouter from './routes/todos/index.js';
import type { Request } from './types.js';

const app = express();

app.use(express.json());
app.use(cookieparser());

getDb();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(opts.port, () => {
    log('INFO', `Server is running on port ${opts.port}`);
});

app.post('/login', login);
app.post('/signup', signup);
app.use('/todos', todosRouter);

if (!opts.devMode)
    app.use((err: Error, req: Request, res: Response) => {
        console.error('Unhandled error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    });