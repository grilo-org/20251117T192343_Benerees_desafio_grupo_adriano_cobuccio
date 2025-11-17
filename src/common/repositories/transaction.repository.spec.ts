import { TransactionRepository } from './transaction.repository';
import * as TxModel from '../models/transaction.model';

describe('TransactionRepository', () => {
    const fakeSequelize = { some: 'instance' } as any;
    const repo = new TransactionRepository(fakeSequelize);

    afterEach(() => jest.restoreAllMocks());

    it('finds by id', async () => {
        const tx = { id: 't1' };
        (TxModel as any).TransactionModel.findByPk = jest
            .fn()
            .mockResolvedValue(tx);
        const res = await repo.findById('t1');
        expect(res).toBe(tx);
    });

    it('creates with options', async () => {
        const payload = { amount: '1.00' } as any;
        (TxModel as any).TransactionModel.create = jest
            .fn()
            .mockResolvedValue(payload);
        const res = await repo.create(payload, { transaction: {} });
        expect(res).toBe(payload);
    });

    it('update calls instance.update', async () => {
        const inst: any = { update: jest.fn().mockResolvedValue(true) };
        const res = await repo.update(inst, { status: 'ok' } as any);
        expect(inst.update).toHaveBeenCalledWith({ status: 'ok' });
    });

    it('returns sequelize instance', () => {
        expect(repo.getSequelizeInstance()).toBe(fakeSequelize);
    });

    it('findByUser returns paginated shape', async () => {
        const rows = [{ id: 'a' }];
        (TxModel as any).TransactionModel.findAndCountAll = jest
            .fn()
            .mockResolvedValue({ rows, count: 1 });
        const res = await repo.findByUser('u1', { page: 1, limit: 10 } as any);
        expect(res.items).toBe(rows);
        expect(res.total).toBe(1);
    });
});
