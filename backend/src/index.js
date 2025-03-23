import * as db from './db.js';
import { createServer } from './server.js';
import { router } from './routes/index.js';

const server = createServer(router);

db.initialize().then(() => {
    server.listen(4444, () => {
        console.log('Server started');
    });
});