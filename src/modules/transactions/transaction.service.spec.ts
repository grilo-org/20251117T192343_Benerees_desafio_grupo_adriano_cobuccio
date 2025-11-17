import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
    it('transfers between users when balance sufficient', async () => {
        const sender: any = {
            id: 's',
            balance: '100.00',
            update: jest.fn().mockResolvedValue(true),
        };
        const receiver: any = {
            id: 'r',
            balance: '0.00',
            update: jest.fn().mockResolvedValue(true),
        };
        const userRepo: any = {
            findById: jest
                .fn()
                .mockImplementation((id) =>
                    id === 's'
                        ? Promise.resolve(sender)
                        : Promise.resolve(receiver),
                ),
        };
        const transactionRepository: any = {
            create: jest.fn().mockResolvedValue({ id: 'tx1' }),
            getSequelizeInstance: () => ({ transaction: (cb: any) => cb({}) }),
        };
        const svc = new TransactionService(userRepo, transactionRepository);
        const transaction = await svc.transfer('s', 'r', '10.00');
        expect(transactionRepository.create).toHaveBeenCalled();
        expect(sender.update).toHaveBeenCalled();
        expect(receiver.update).toHaveBeenCalled();
    });

    it('transfer throws on self transfer, invalid amount and insufficient balance', async () => {
        const svc = new (require('./transaction.service').TransactionService)(
            null as any,
            null as any,
        );
        await expect(svc.transfer('a', 'a', '1.00')).rejects.toThrow(
            'Cannot transfer to self',
        );

        // invalid amount parse -> BadRequest
        const userRepo: any = { findById: jest.fn() };
        const transactionRepository: any = {
            getSequelizeInstance: () => ({ transaction: (cb: any) => cb({}) }),
        };
        const svc2 = new (require('./transaction.service').TransactionService)(
            userRepo,
            transactionRepository,
        );
        await expect(svc2.transfer('s', 'r', 'not-a-number')).rejects.toThrow(
            'Invalid amount',
        );

        // insufficient balance
        const sender: any = { id: 's', balance: '1.00' };
        const receiver: any = { id: 'r', balance: '0.00' };
        userRepo.findById
            .mockResolvedValueOnce(sender)
            .mockResolvedValueOnce(receiver);
        await expect(svc2.transfer('s', 'r', '10.00')).rejects.toThrow(
            'Insufficient balance',
        );
    });

    it('transfer throws when amount is zero or negative', async () => {
        const svc = new (require('./transaction.service').TransactionService)(
            null as any,
            null as any,
        );
        await expect(svc.transfer('s', 'r', '0')).rejects.toThrow(
            'Invalid amount',
        );
        await expect(svc.transfer('s', 'r', '-1.00')).rejects.toThrow(
            'Invalid amount',
        );
    });

    it('reverse throws when transaction not found and when already reversed', async () => {
        const transactionRepository: any = {
            getSequelizeInstance: () => ({ transaction: (cb: any) => cb({}) }),
            findById: jest.fn(),
        };
        const userRepo: any = { findById: jest.fn() };
        const svc = new (require('./transaction.service').TransactionService)(
            userRepo,
            transactionRepository,
        );

        transactionRepository.findById.mockResolvedValueOnce(null);
        await expect(svc.reverse('u', 'tx')).rejects.toThrow(
            'Transaction not found',
        );

        const tx = { id: 'tx', status: 'reversed' };
        transactionRepository.findById.mockResolvedValueOnce(tx as any);
        await expect(svc.reverse('u', 'tx')).rejects.toThrow(
            'Already reversed',
        );
    });

    it('transfer throws when create returns null (transaction not created)', async () => {
        const sender: any = {
            id: 's',
            balance: '100.00',
            update: jest.fn().mockResolvedValue(true),
        };
        const receiver: any = {
            id: 'r',
            balance: '0.00',
            update: jest.fn().mockResolvedValue(true),
        };
        const userRepo: any = {
            findById: jest
                .fn()
                .mockImplementation((id) =>
                    id === 's'
                        ? Promise.resolve(sender)
                        : Promise.resolve(receiver),
                ),
        };
        const transactionRepository: any = {
            create: jest.fn().mockResolvedValue(null),
            getSequelizeInstance: () => ({ transaction: (cb: any) => cb({}) }),
        };
        const svc = new (require('./transaction.service').TransactionService)(
            userRepo,
            transactionRepository,
        );
        await expect(svc.transfer('s', 'r', '10.00')).rejects.toThrow(
            'Transaction not created',
        );
    });

    it('transfer throws when sender or receiver not found', async () => {
        const transactionRepository: any = {
            getSequelizeInstance: () => ({ transaction: (cb: any) => cb({}) }),
        };
        const userRepo: any = { findById: jest.fn() };
        // sender missing
        userRepo.findById
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce({ id: 'r', balance: '0.00' });
        const svc = new (require('./transaction.service').TransactionService)(
            userRepo,
            transactionRepository,
        );
        await expect(svc.transfer('s', 'r', '1.00')).rejects.toThrow(
            'Sender or receiver not found',
        );
    });

    it('reverse throws when requestor not found', async () => {
        const transactionRepository: any = {
            getSequelizeInstance: () => ({ transaction: (cb: any) => cb({}) }),
            findById: jest.fn(),
        };
        const userRepo: any = { findById: jest.fn() };
        const svc = new (require('./transaction.service').TransactionService)(
            userRepo,
            transactionRepository,
        );
        const tx1 = {
            id: 'tx1',
            status: 'completed',
            senderId: 's',
            receiverId: 'r',
            amount: '10.00',
        } as any;
        transactionRepository.findById.mockResolvedValueOnce(tx1);
        userRepo.findById.mockResolvedValueOnce(null);
        await expect(svc.reverse('req', 'tx1')).rejects.toThrow(
            'Requestor not found',
        );
    });

    it('reverse throws forbidden when requestor not allowed', async () => {
        const transactionRepository: any = {
            getSequelizeInstance: () => ({ transaction: (cb: any) => cb({}) }),
            findById: jest.fn(),
        };
        const userRepo: any = { findById: jest.fn() };
        const svc = new (require('./transaction.service').TransactionService)(
            userRepo,
            transactionRepository,
        );
        const tx1 = {
            id: 'tx1',
            status: 'completed',
            senderId: 's',
            receiverId: 'r',
            amount: '10.00',
        } as any;
        transactionRepository.findById.mockResolvedValueOnce(tx1);
        // requestor exists but not admin and is neither sender nor receiver
        userRepo.findById.mockResolvedValueOnce({ id: 'x', role: 'user' });
        // next calls for sender/receiver (these may not be reached but set defensively)
        userRepo.findById.mockResolvedValueOnce({ id: 's' });
        userRepo.findById.mockResolvedValueOnce({ id: 'r' });
        await expect(svc.reverse('x', 'tx1')).rejects.toThrow(
            'Not allowed to reverse this transaction',
        );
    });

    it('reverse throws when users involved not found', async () => {
        const transactionRepository: any = {
            getSequelizeInstance: () => ({ transaction: (cb: any) => cb({}) }),
            findById: jest.fn(),
        };
        const userRepo: any = { findById: jest.fn() };
        const svc = new (require('./transaction.service').TransactionService)(
            userRepo,
            transactionRepository,
        );
        const tx1 = {
            id: 'tx1',
            status: 'completed',
            senderId: 's',
            receiverId: 'r',
            amount: '10.00',
        } as any;
        transactionRepository.findById.mockResolvedValueOnce(tx1);
        // requestor is admin
        userRepo.findById.mockResolvedValueOnce({ id: 'admin', role: 'admin' });
        // sender not found
        userRepo.findById.mockResolvedValueOnce(null);
        await expect(svc.reverse('admin', 'tx1')).rejects.toThrow(
            'Users involved not found',
        );
    });

    it('reverse throws when receiver balance would go negative', async () => {
        const transactionRepository: any = {
            getSequelizeInstance: () => ({ transaction: (cb: any) => cb({}) }),
            findById: jest.fn(),
        };
        const userRepo: any = { findById: jest.fn() };
        const svc = new (require('./transaction.service').TransactionService)(
            userRepo,
            transactionRepository,
        );
        const tx1 = {
            id: 'tx1',
            status: 'completed',
            senderId: 's',
            receiverId: 'r',
            amount: '10.00',
        } as any;
        transactionRepository.findById.mockResolvedValueOnce(tx1);
        // requestor admin
        userRepo.findById.mockResolvedValueOnce({ id: 'admin', role: 'admin' });
        // sender
        userRepo.findById.mockResolvedValueOnce({
            id: 's',
            balance: '0.00',
            update: jest.fn().mockResolvedValue(true),
        });
        // receiver has 0.00 -> will go negative
        userRepo.findById.mockResolvedValueOnce({
            id: 'r',
            balance: '0.00',
            update: jest.fn().mockResolvedValue(true),
        });
        await expect(svc.reverse('admin', 'tx1')).rejects.toThrow(
            'Receiver balance would become negative on reversal',
        );
    });

    it('reverse success updates transaction status to reversed', async () => {
        const transactionRepository: any = {
            getSequelizeInstance: () => ({ transaction: (cb: any) => cb({}) }),
            findById: jest.fn(),
        };
        const userRepo: any = { findById: jest.fn() };
        const svc = new (require('./transaction.service').TransactionService)(
            userRepo,
            transactionRepository,
        );
        const txSuccess: any = {
            id: 'tx2',
            status: 'completed',
            senderId: 's',
            receiverId: 'r',
            amount: '10.00',
            update: jest.fn().mockResolvedValue(true),
        };
        transactionRepository.findById.mockResolvedValueOnce(txSuccess);
        // requestor admin then sender then receiver
        userRepo.findById
            .mockResolvedValueOnce({ id: 'admin', role: 'admin' })
            .mockResolvedValueOnce({
                id: 's',
                balance: '0.00',
                update: jest.fn().mockResolvedValue(true),
            })
            .mockResolvedValueOnce({
                id: 'r',
                balance: '20.00',
                update: jest.fn().mockResolvedValue(true),
            });

        const res = await svc.reverse('admin', 'tx2');
        expect(txSuccess.update).toHaveBeenCalledWith(
            { status: 'reversed' },
            { transaction: {} },
        );
        expect(res).toBe(txSuccess);
    });

    it('listByUser delegates to repository', async () => {
        const transactionRepository: any = {
            findByUser: jest.fn().mockResolvedValue({ items: [], total: 0 }),
        };
        const svc = new (require('./transaction.service').TransactionService)(
            null as any,
            transactionRepository,
        );
        const r = await svc.listByUser('u1', { page: 1, limit: 10 } as any);
        expect(transactionRepository.findByUser).toHaveBeenCalledWith('u1', {
            page: 1,
            limit: 10,
        } as any);
        expect(r.total).toBe(0);
    });
});
