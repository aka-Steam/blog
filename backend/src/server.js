import express from 'express';
import cors from 'cors';
import * as db from './db.js';
import { router } from './routes/index.js';
import { Telegraf } from 'telegraf';

const createServer = (router) => {
    const server = express();

    server.use(express.json());
    server.use(cors());
    server.use(router)

    return server
}


export const bot = new Telegraf(process.env.BOT_TOKEN);


const server = createServer(router);

let serverListener;

const initServer = async (port) => {
    await db.initialize().then(() => {
        serverListener = server.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    });
    bot.start((ctx) => ctx.reply('Привет! Я бот с уведомлениями о новых статьях!'));
    bot.launch();
}

const serverClose = async (port) => {
    await db.close().then(() => {
        console.log('Server closed');
        serverListener.close();
    });
    await bot.stop();
};


export { createServer, initServer, serverClose, server }