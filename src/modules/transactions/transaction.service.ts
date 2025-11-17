import {
    Injectable,
    BadRequestException,
    NotFoundException,
    ConflictException,
    ForbiddenException,
} from '@nestjs/common';
import { UserRepository } from '../../common/repositories/user.repository';
import { TransactionRepository } from '../../common/repositories/transaction.repository';
import { ITransactionService } from './interfaces/transaction.service.interface';
import { TransactionModel } from '../../common/models/transaction.model';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import MoneyUtils from '../../common/utils/money.utils';

@Injectable()
export class TransactionService implements ITransactionService {
    constructor(
        private userRepo: UserRepository,
        private transactionRepository: TransactionRepository,
    ) {}

    async transfer(
        senderId: string,
        receiverId: string,
        amountStr: string,
    ): Promise<TransactionResponseDto> {
        if (senderId === receiverId)
            throw new BadRequestException('Cannot transfer to self');
        let amountDecimal;
        try {
            amountDecimal = MoneyUtils.parse(amountStr);
        } catch (err) {
            throw new BadRequestException('Invalid amount');
        }

        if (amountDecimal.lte(0))
            throw new BadRequestException('Invalid amount');

        const sequelize = this.transactionRepository.getSequelizeInstance();

        const sender = await this.userRepo.findById(senderId);
        const receiver = await this.userRepo.findById(receiverId);
        if (!sender || !receiver)
            throw new NotFoundException('Sender or receiver not found');

        const senderBalance = MoneyUtils.parse(sender.balance);
        if (senderBalance.lt(amountDecimal))
            throw new ConflictException('Insufficient balance');

        return await sequelize.transaction(async (t) => {
            const newSenderBalance = MoneyUtils.sub(
                senderBalance,
                amountDecimal,
            ).toFixed(2);
            await sender.update(
                { balance: newSenderBalance },
                { transaction: t },
            );

            const receiverBalance = MoneyUtils.parse(receiver.balance);
            const newReceiverBalance = MoneyUtils.add(
                receiverBalance,
                amountDecimal,
            ).toFixed(2);
            await receiver.update(
                { balance: newReceiverBalance },
                { transaction: t },
            );

            const transactionData = await this.transactionRepository.create(
                {
                    senderId,
                    receiverId,
                    amount: MoneyUtils.toString(amountDecimal),
                    status: 'completed',
                } as TransactionModel,
                { transaction: t },
            );
            if (!transactionData)
                throw new NotFoundException('Transaction not created');
            return transactionData as TransactionResponseDto;
        });
    }

    async reverse(
        requestorId: string,
        transactionId: string,
    ): Promise<TransactionResponseDto> {
        const sequelize = this.transactionRepository.getSequelizeInstance();

        return await sequelize.transaction(async (t) => {
            const transactionData =
                await this.transactionRepository.findById(transactionId);
            if (!transactionData)
                throw new NotFoundException('Transaction not found');
            if (transactionData.status === 'reversed')
                throw new BadRequestException('Already reversed');

            const requestor = await this.userRepo.findById(requestorId);
            if (!requestor) throw new NotFoundException('Requestor not found');

            if (
                requestor.role !== 'admin' &&
                requestorId !== transactionData.senderId &&
                requestorId !== transactionData.receiverId
            ) {
                throw new ForbiddenException(
                    'Not allowed to reverse this transaction',
                );
            }

            const sender = await this.userRepo.findById(
                transactionData.senderId,
            );
            const receiver = await this.userRepo.findById(
                transactionData.receiverId,
            );
            if (!sender || !receiver)
                throw new NotFoundException('Users involved not found');

            const amountDecimal = MoneyUtils.parse(transactionData.amount);

            const senderBalance = MoneyUtils.add(
                MoneyUtils.parse(sender.balance),
                amountDecimal,
            );
            const receiverBalance = MoneyUtils.sub(
                MoneyUtils.parse(receiver.balance),
                amountDecimal,
            );
            if (receiverBalance.lt(0))
                throw new ConflictException(
                    'Receiver balance would become negative on reversal',
                );

            await sender.update(
                { balance: senderBalance.toFixed(2) },
                { transaction: t },
            );
            await receiver.update(
                { balance: receiverBalance.toFixed(2) },
                { transaction: t },
            );

            (await transactionData.update(
                { status: 'reversed' },
                { transaction: t },
            )) as TransactionResponseDto;
            return transactionData;
        });
    }

    async listByUser(userId: string, paginationQuery: PaginationQueryDto) {
        return await this.transactionRepository.findByUser(
            userId,
            paginationQuery,
        );
    }
}
