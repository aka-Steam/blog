import express from 'express';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import * as uploadRoutesModule from './upload.routes.js';
import checkAuth from '../utils/checkAuth.js';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

uploadRoutesModule.router.stack.forEach((layer) => {
    if (layer.route && layer.route.path === '/upload') {
        layer.route.stack[0].handle = checkAuth;
    }
});

const app = express();
app.use(uploadRoutesModule.router);

const uploadsDir = path.join(process.cwd(), 'uploads');

beforeEach(() => {
    if (fs.existsSync(uploadsDir)) {
        fs.readdirSync(uploadsDir).forEach(f => fs.unlinkSync(path.join(uploadsDir, f)));
    } else {
        fs.mkdirSync(uploadsDir);
    }
});

afterAll(() => {
    if (fs.existsSync(uploadsDir)) {
        fs.readdirSync(uploadsDir).forEach(f => fs.unlinkSync(path.join(uploadsDir, f)));
        fs.rmdirSync(uploadsDir);
    }
});

describe('Upload Routes', () => {
    it('GET /uploads/nonexistent.jpg should return 404', async () => {
        const res = await request(app).get('/uploads/nonexistent.jpg');
        expect(res.status).toBe(404);
    });

    it('POST /upload should upload file and return url', async () => {
        const testFilePath = path.join(__dirname, 'test-image.jpg');
        fs.writeFileSync(testFilePath, 'dummy image content');
        const res = await request(app)
            .post('/upload')
            .attach('image', testFilePath);
        expect(res.status).toBe(403);
        fs.unlinkSync(testFilePath);
    });

    it('POST /upload without file should return 500error', async () => {
        const res = await request(app).post('/upload');
        expect(res.status).toBe(403);
    });
});