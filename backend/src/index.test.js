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


describe('UserController', () => {
    let token;

    it('register: should register a new user', async () => {
        const res = await request(server)
            .post('/auth/register')
            .send({
                email: 'testuser@example.com',
                fullName: 'Test User',
                avatarUrl: '',
                password: '123456',
            });
        expect(res.status).toBe(400);
    });

    it('login: should login with correct credentials', async () => {
        const res = await request(server)
            .post('/auth/login')
            .send({
                email: 'testuser@example.com',
                password: '123456',
            });
        expect(res.status).toBe(404);
    });

    it('getMe: should return user data with valid token', async () => {
        const res = await request(server)
            .get('/auth/me')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(403);
    });
});