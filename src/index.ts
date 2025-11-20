import express, { type NextFunction, type Response } from 'express';
import cookieparser from 'cookie-parser';

import { opts, log } from './utils.js';
import getDb from './db.js';
import login from './routes/login.js';
import logout from './routes/logout.js';
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
app.post('/logout', logout);
app.post('/signup', signup);
app.use('/todos', todosRouter);

if (!opts.devMode)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error('Unhandled error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    });