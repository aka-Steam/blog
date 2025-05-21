import User from './models/User.js';
import Post from './models/Post.js';
import { sequelize } from './db.js';


describe('User model', () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    it('should not create user without email', async () => {
        await expect(
            User.create({ fullName: 'No Email', passwordHash: 'hash' })
        ).rejects.toThrow(/notNull Violation/i);
    });

    it('should not allow duplicate emails', async () => {
        await User.create({ fullName: 'User1', email: 'a@a.a', passwordHash: 'hash' });
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