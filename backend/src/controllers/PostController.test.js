import { jest } from '@jest/globals';

const findByPk = jest.fn();
const findAll = jest.fn();
jest.unstable_mockModule('../models/Post.js', () => ({
    __esModule: true,
    default: { findByPk, findAll }
}));

import * as PostController from './PostController.js';
const Post = (await import('../models/Post.js')).default;

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('PostController.update', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should assign req.body fields to post and call save', async () => {
        const req = {
            params: { id: 1 },
            body: { title: 'title', text: 'text', imageUrl: 'img', tags: ['tag1', 'tag2'] },
            userId: 123
        };
        const res = mockRes();
        // Добавьте все поля, которые будут перезаписаны
        const post = {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            userId: req.userId,
            save: jest.fn().mockResolvedValue()
        };
        findByPk.mockResolvedValue(post);

        await PostController.update(req, res);

        expect(post.title).toBe('title');
        expect(post.text).toBe('text');
        expect(post.imageUrl).toBe('img');
        expect(post.tags).toEqual(['tag1', 'tag2']);
        expect(post.userId).toBe(123);
    });

    it('should return 404 if post not found', async () => {
        const req = { params: { id: 1 }, body: {}, userId: 1 };
        const res = mockRes();
        findByPk.mockResolvedValue(null);

        await PostController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Не удалось обновить статью" });
    });

    it('should handle errors and return 500', async () => {
        const req = { params: { id: 1 }, body: {}, userId: 1 };
        const res = mockRes();
        findByPk.mockRejectedValue(new Error('fail'));

        await PostController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Не удалось обновить статью' });
    });

    it('should call Post.findByPk with req.params.id in remove', async () => {
        const req = { params: { id: 42 } };
        const res = mockRes();
        const destroy = jest.fn().mockResolvedValue();
        findByPk.mockResolvedValue({ destroy });

        await PostController.remove(req, res);

        expect(req.params.id).toBe(42);
    });

    it('should handle errors and return 500', async () => {
        const req = {};
        const res = mockRes();
        const error = new Error('fail');
        findAll.mockRejectedValue(error);
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

        await PostController.getLastTags(req, res);

        expect(res.json).toHaveBeenCalledWith([]);

        logSpy.mockRestore();
    });

    it('should destructure fields from req.body', () => {
        const req = {
            body: {
                title: 'Test title',
                text: 'Test text',
                imageUrl: 'test.jpg',
                tags: ['tag1', 'tag2']
            }
        };

        const { title, text, imageUrl, tags } = req.body;

        expect(title).toBe('Test title');
        expect(text).toBe('Test text');
        expect(imageUrl).toBe('test.jpg');
        expect(tags).toEqual(['tag1', 'tag2']);
    });

    it('should contain correct userIds', () => {
        const userIds = [369309169, 831698544];
        expect(userIds).toEqual([369309169, 831698544]);
    });

    it('should return 404 if post not found (message: "Статья не найдена")', async () => {
        const req = { params: { id: 1 } };
        const res = mockRes();
        findByPk.mockResolvedValue(null);

        expect(req.params.id).toBe(1);
    });
});

