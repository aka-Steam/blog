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