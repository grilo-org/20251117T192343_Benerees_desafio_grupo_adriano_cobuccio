import { UserRepository } from './user.repository';
import * as UserModel from '../models/user.model';

describe('UserRepository', () => {
    const repo = new UserRepository({} as any);

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('finds by id', async () => {
        const u = { id: '1' };
        (UserModel as any).User.findByPk = jest.fn().mockResolvedValue(u);
        const res = await repo.findById('1');
        expect(res).toBe(u);
    });

    it('finds by email', async () => {
        const u = { id: '2' };
        (UserModel as any).User.findOne = jest.fn().mockResolvedValue(u);
        const res = await repo.findByEmail('a@b');
        expect(res).toBe(u);
    });

    it('creates a user', async () => {
        const payload = { name: 'n' } as any;
        (UserModel as any).User.create = jest.fn().mockResolvedValue(payload);
        const res = await repo.create(payload);
        expect(res).toBe(payload);
    });

    it('updates a user via instance.update', async () => {
        const inst: any = { update: jest.fn().mockResolvedValue({ ok: true }) };
        const res = await repo.update(inst, { name: 'x' });
        expect(inst.update).toHaveBeenCalledWith({ name: 'x' });
    });

    it('findAll returns paginated shape', async () => {
        const rows = [{ id: 'a' }, { id: 'b' }];
        (UserModel as any).User.findAndCountAll = jest
            .fn()
            .mockResolvedValue({ rows, count: 2 });
        const res = await repo.findAll({ page: 1, limit: 10 } as any);
        expect(res.items).toBe(rows);
        expect(res.total).toBe(2);
        expect(res.page).toBe(1);
    });

    it('softDelete returns null when not found and user when found', async () => {
        (UserModel as any).User.findByPk = jest
            .fn()
            .mockResolvedValueOnce(null);
        const res1 = await repo.softDelete('x');
        expect(res1).toBeNull();

        const inst: any = { destroy: jest.fn().mockResolvedValue(true) };
        (UserModel as any).User.findByPk = jest
            .fn()
            .mockResolvedValueOnce(inst);
        const res2 = await repo.softDelete('y');
        expect(res2).toBe(inst);
        expect(inst.destroy).toHaveBeenCalled();
    });

    it('restore returns null when not found and calls restore when found', async () => {
        (UserModel as any).User.findByPk = jest
            .fn()
            .mockResolvedValueOnce(null);
        const res1 = await repo.restore('x');
        expect(res1).toBeNull();

        const inst: any = { restore: jest.fn().mockResolvedValue(true) };
        (UserModel as any).User.findByPk = jest
            .fn()
            .mockResolvedValueOnce(inst);
        const res2 = await repo.restore('y');
        expect(res2).toBe(inst);
        expect(inst.restore).toHaveBeenCalled();
    });
});
