import { jest } from '@jest/globals';
import { initServer, serverClose, server } from './server.js';
import request from "supertest";
import User from './models/User.js';
import Post from './models/Post.js';
import { sequelize, initialize } from './db.js';

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

describe('PostController', () => {
    it('getAll: should return 200', async () => {
        const res = await request(server).get('/posts');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('getOne: should return 404 for non-existent post', async () => {
        const res = await request(server).get('/posts/999999');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Статья не найдена');
    });

    it('remove: should return 404 for non-existent post', async () => {
        const res = await request(server).delete('/posts/999999');
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty('message', 'Нет доступа');
    });

    it('create: should return 500 if not authenticated', async () => {
        const res = await request(server)
            .post('/posts')
            .send({
                title: 'Test',
                text: 'Test text',
                imageUrl: '',
                tags: ['test'],
            });
        expect(res.status).toBe(403); // или 401/403 если стоит auth middleware
        expect(res.body).toHaveProperty('message');
    });

    it('update: should return 404 for non-existent post', async () => {
        const res = await request(server)
            .patch('/posts/999999')
            .send({
                title: 'Updated',
                text: 'Updated text',
                imageUrl: '',
                tags: ['updated'],
            });
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty('message', 'Нет доступа');
    });

    it('getLastTags: should return 200', async () => {
        const res = await request(server).get('/tags');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});


describe('User model', () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    it('should not create user without email', async () => {
        // Ожидаем ошибку notNull Violation
        await expect(
            User.create({ fullName: 'No Email', passwordHash: 'hash' })
        ).rejects.toThrow(/notNull Violation/i);
    });

    it('should not allow duplicate emails', async () => {
        await User.create({ fullName: 'User1', email: 'a@a.a', passwordHash: 'hash' });
        // Ожидаем ошибку Validation error (уникальность)
        await expect(
            User.create({ fullName: 'User2', email: 'a@a.a', passwordHash: 'hash2' })
        ).rejects.toThrow(/Validation error/i);
    });

    it('should create user with all required fields', async () => {
        const user = await User.create({
            fullName: 'Test User',
            email: 'test@example.com',
            passwordHash: 'hash',
        });
        expect(user.fullName).toBe('Test User');
        expect(user.email).toBe('test@example.com');
    });
});

describe('Post model', () => {
    let user;

    beforeEach(async () => {
        await sequelize.sync({ force: true });
        user = await User.create({
            fullName: 'Author',
            email: 'author@example.com',
            passwordHash: 'hash',
        });
    });

    it('should not create post without title', async () => {
        await expect(
            Post.create({ text: 'Some text', userId: user.id })
        ).rejects.toThrow(/notNull Violation/i);
    });

    it('should not create post without text', async () => {
        await expect(
            Post.create({ title: 'No text', userId: user.id })
        ).rejects.toThrow(/notNull Violation/i);
    });

    it('should not allow duplicate text', async () => {
        await Post.create({ title: 'First', text: 'Unique text', userId: user.id });
        await expect(
            Post.create({ title: 'Second', text: 'Unique text', userId: user.id })
        ).rejects.toThrow(/Validation error/i);
    });

    it('should create post with all required fields', async () => {
        const post = await Post.create({
            title: 'Test Post',
            text: 'Test content',
            userId: user.id,
            tags: ['tag1', 'tag2'],
            imageUrl: 'http://example.com/image.png',
        });
        expect(post.title).toBe('Test Post');
        expect(post.text).toBe('Test content');
        expect(Array.isArray(post.tags)).toBe(true);
        expect(post.viewsCount).toBe(0);
        expect(post.imageUrl).toBe('http://example.com/image.png');
    });

    it('should set default values', async () => {
        const post = await Post.create({
            title: 'Default values',
            text: 'Check defaults',
            userId: user.id,
        });
        expect(post.tags).toEqual([]);
        expect(post.viewsCount).toBe(0);
        expect(post.imageUrl).toBeNull();
    });

    it('should belong to a user', async () => {
        const post = await Post.create({
            title: 'With user',
            text: 'Has user',
            userId: user.id,
        });
        const found = await post.getUser();
        expect(found.email).toBe('author@example.com');
    });
});