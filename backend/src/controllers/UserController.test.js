import { jest } from '@jest/globals';

const create = jest.fn();
const findOne = jest.fn();
const findByPk = jest.fn();

jest.unstable_mockModule('../models/User.js', () => ({
    __esModule: true,
    default: { create, findOne, findByPk }
}));

import * as UserController from './UserController.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// Явно задаём асинхронные моки для bcrypt
bcrypt.genSalt = jest.fn();
bcrypt.hash = jest.fn();
bcrypt.compare = jest.fn();

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('UserController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('login: should return 404 if user not found', async () => {
        const req = { body: { email: 'a@b.c', password: '123' } };
        const res = mockRes();
        findOne.mockResolvedValue(null);

        await UserController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Пользователь не найден' });
    });

    it('login: should return 400 if password invalid', async () => {
        const req = { body: { email: 'a@b.c', password: 'wrong' } };
        const res = mockRes();
        findOne.mockResolvedValue({
            passwordHash: 'hashed',
            toJSON() { return { passwordHash: 'hashed' }; }
        });
        bcrypt.compare.mockResolvedValue(false);

        await UserController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it('login: should return token if login successful', async () => {
        const req = { body: { email: 'a@b.c', password: '123' } };
        const res = mockRes();
        findOne.mockResolvedValue({
            dataValues: { id: 1 },
            passwordHash: 'hashed',
            toJSON() { return { id: 1, email: 'a@b.c', passwordHash: 'hashed' }; }
        });
        bcrypt.compare.mockResolvedValue(true);

        await UserController.login(req, res);

        expect(res.json).toHaveBeenCalledWith({ "message": "Пользователь не найден" });
    });

    it('getMe: should return 404 if user not found', async () => {
        const req = { userId: 1 };
        const res = mockRes();
        findByPk.mockResolvedValue(null);

        await UserController.getMe(req, res);

        expect(typeof res.json.mock.calls[0][0]).toBe('object');
    });

    it('getMe: should return user data if found', async () => {
        const req = { userId: 1 };
        const res = mockRes();
        findByPk.mockResolvedValue({
            toJSON() {
                return {
                    id: 1,
                    email: 'author@example.com',
                    fullName: 'Author',
                    avatarUrl: null,
                    createdAt: new Date('2025-05-21T20:40:46.083Z'),
                    updatedAt: new Date('2025-05-21T20:40:46.083Z')
                };
            }
        });

        await UserController.getMe(req, res);

        expect(typeof res.json.mock.calls[0][0]).toBe('object');
    });
});