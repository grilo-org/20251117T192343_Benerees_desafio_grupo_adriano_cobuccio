import { UserService } from './user.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
jest.mock('bcrypt', () => ({ hash: jest.fn(), compare: jest.fn() }));
const bcryptMock = require('bcrypt');
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
    afterEach(() => jest.restoreAllMocks());

    it('getProfile and findById throw when not found', async () => {
        const userRepo: any = { findById: jest.fn().mockResolvedValue(null) };
        const svc = new UserService(userRepo);
        await expect(svc.getProfile('x')).rejects.toThrow('User not found');
        await expect(svc.findById('x')).rejects.toThrow('User not found');
    });

    it('getProfile and findById return user when found', async () => {
        const user = { id: 'u1', email: 'a@b' } as any;
        const userRepo: any = { findById: jest.fn().mockResolvedValue(user) };
        const svc = new UserService(userRepo);
        const p = await svc.getProfile('u1');
        expect(p).toBe(user);
        const f = await svc.findById('u1');
        expect(f).toBe(user);
    });

    it('list calls repository findAll', async () => {
        const userRepo: any = {
            findAll: jest.fn().mockResolvedValue({ items: [], total: 0 }),
        };
        const svc = new UserService(userRepo);
        const res = await svc.list({} as any);
        expect(userRepo.findAll).toHaveBeenCalled();
        expect(res.items).toBeDefined();
    });

    it('update throws when not found and throws on email conflict', async () => {
        const user = { id: '1', email: 'a@b' } as any;
        const userRepo: any = { findById: jest.fn().mockResolvedValue(null) };
        const svc = new UserService(userRepo);
        await expect(svc.update('1', { name: 'x' } as any)).rejects.toThrow(
            'User not found',
        );

        // email conflict
        userRepo.findById.mockResolvedValueOnce(user);
        userRepo.findByEmail = jest.fn().mockResolvedValue({ id: 'other' });
        await expect(
            svc.update('1', { email: 'other@x' } as any),
        ).rejects.toThrow('Email already registered');
    });

    it('update hashes password and calls update', async () => {
        const user = { id: '1', email: 'a@b' } as any;
        const updated = { id: '1', name: 'n' };
        const userRepo: any = {
            findById: jest.fn().mockResolvedValue(user),
            findByEmail: jest.fn().mockResolvedValue(null),
            update: jest.fn().mockResolvedValue(updated),
        };
        bcryptMock.hash.mockResolvedValue('hashed');
        const svc = new UserService(userRepo);
        const res = await svc.update('1', { password: 'p' } as any);
        expect(bcrypt.hash).toHaveBeenCalled();
        expect(userRepo.update).toHaveBeenCalled();
        expect(res).toBe(updated);
    });

    it('softDelete and restore throw when not found and return ids when found', async () => {
        const userRepo: any = {
            softDelete: jest.fn().mockResolvedValue(null),
            restore: jest.fn().mockResolvedValue(null),
        };
        const svc = new UserService(userRepo);
        await expect(svc.softDelete('x')).rejects.toThrow('User not found');
        await expect(svc.restore('x')).rejects.toThrow('User not found');

        const deleted = { id: 'd' };
        userRepo.softDelete.mockResolvedValueOnce(deleted);
        const res = await svc.softDelete('d');
        expect(res).toEqual({ id: 'd' });

        const restored = { id: 'r', updatedAt: new Date() };
        userRepo.restore.mockResolvedValueOnce(restored);
        const r = await svc.restore('r');
        expect(r.id).toBe('r');
        expect(r.restoredAt).toBeInstanceOf(Date);
    });
});
