import { initServer, serverClose, server } from './server.js';
import request from "supertest";

beforeAll(async () => {
    await initServer(1337);
});

afterAll(async () => {
    await serverClose()
    // setTimeout(() => process.exit(Number(0)), 1000)
})

describe('User Routes', () => {
    it('should get user info', async () => {
        const response = await request(server).get('/auth/me');
        expect(response.status).toBe(403);
    });
});

describe('Post Routes', () => {
    it('should get all posts', async () => {
        const response = await request(server).get('/posts');
        expect(response.status).toBe(200);
    });

    it('should get a single post by ID', async () => {
        const response = await request(server).get('/posts/1');
        expect(response.status).toBe(200);
    });
});