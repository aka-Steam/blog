import express, { Router } from 'express';
import cors from 'cors';
import * as db from './db.js';
import { router } from './routes/index.js';

const createServer = (router) => {
    const server = express();

    server.use(express.json());
    server.use(cors());
    server.use(router)

    return server
}

const server = createServer(router);

let serverListener;

const initServer = async (port) => {
    await db.initialize().then(() => {
        serverListener = server.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    });
}

const serverClose = async (port) => {
    await db.close().then(() => {
        console.log('Server closed');
        serverListener.close();
    });
};


export { createServer, initServer, serverClose, server }