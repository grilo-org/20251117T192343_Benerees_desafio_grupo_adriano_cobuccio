import { AuthService } from './auth.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
jest.mock('bcrypt', () => ({ hash: jest.fn(), compare: jest.fn() }));
const bcryptMock = require('bcrypt');
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    it('registers a new user', async () => {
        const userRepo: any = {
            findByEmail: jest.fn().mockResolvedValue(null),
            create: jest
                .fn()
                .mockResolvedValue({ id: '1', name: 'n', email: 'e' }),
        };
        const jwt: any = { sign: jest.fn().mockReturnValue('token') };
        const svc = new AuthService(userRepo, jwt as any);
        const user = await svc.register('n', 'e@test.com', 'pass');
        expect(userRepo.findByEmail).toHaveBeenCalledWith('e@test.com');
        expect(userRepo.create).toHaveBeenCalled();
        expect(user).toEqual({ id: '1', name: 'n', email: 'e' });
    });

    it('throws ConflictException when email already exists', async () => {
        const userRepo: any = {
            findByEmail: jest.fn().mockResolvedValue({ id: 'exists' }),
        };
        const svc = new AuthService(userRepo, {} as any);
        await expect(svc.register('n', 'e@test.com', 'pass')).rejects.toThrow(
            'Email already registered',
        );
    });

    it('validateUser throws when user not found or wrong password and returns user when ok', async () => {
        const fakeUser: any = { id: '1', email: 'a@b', password: 'hashed' };
        const userRepo: any = { findByEmail: jest.fn() };
        // not found
        userRepo.findByEmail.mockResolvedValueOnce(null);
        const svc = new AuthService(userRepo, {} as any);
        await expect(svc.validateUser('no@one', 'pw')).rejects.toThrow(
            'Invalid credentials',
        );

        // wrong password
        userRepo.findByEmail.mockResolvedValueOnce(fakeUser);
        bcryptMock.compare.mockResolvedValueOnce(false);
        await expect(svc.validateUser('a@b', 'pw')).rejects.toThrow(
            'Invalid credentials',
        );

        // ok
        userRepo.findByEmail.mockResolvedValueOnce(fakeUser);
        bcryptMock.compare.mockResolvedValueOnce(true);
        const user = await svc.validateUser('a@b', 'pw');
        expect(user).toBe(fakeUser);
    });

    it('login returns a token using jwt service', async () => {
        const jwt: any = { sign: jest.fn().mockReturnValue('token-123') };
        const svc = new AuthService({} as any, jwt as any);
        const user: any = { id: 'u1', email: 'e@t', role: 'admin' };
        const res = await svc.login(user);
        expect(jwt.sign).toHaveBeenCalled();
        expect(res).toEqual({ access_token: 'token-123' });
    });
});
