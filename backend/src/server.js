import express, { Router } from 'express';
import cors from 'cors';

const createServer = (router) => {
    const server = express();

    server.use(express.json());
    server.use(cors());
    server.use(router)

    return server
}

export { createServer }