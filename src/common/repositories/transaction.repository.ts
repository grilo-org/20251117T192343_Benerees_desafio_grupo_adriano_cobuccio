import { Injectable, Inject } from '@nestjs/common';
import { Sequelize, Op } from 'sequelize';
import { TransactionModel } from '../models/transaction.model';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { PaginatedTransactionsDto } from '../../modules/transactions/dto/paginated-transactions.dto';

@Injectable()
export class TransactionRepository {
    constructor(@Inject('SEQUELIZE') private readonly sequelize: Sequelize) {}

    async findById(id: string) {
        return TransactionModel.findByPk(id);
    }

    async create(payload: TransactionModel, options?: any) {
        return TransactionModel.create(payload, options);
    }

    async update(
        transactionModel: TransactionModel,
        payload: Partial<TransactionModel>,
    ) {
        return transactionModel.update(payload);
    }

    getSequelizeInstance() {
        return this.sequelize;
    }

    async findByUser(userId: string, paginationQuery: PaginationQueryDto) {
        const page =
            Number(paginationQuery.page) > 0 ? Number(paginationQuery.page) : 1;
        const limit =
            Number(paginationQuery.limit) > 0
                ? Number(paginationQuery.limit)
                : 10;
        const offset = (page - 1) * limit;

        const where = {
            [Op.or]: [{ senderId: userId }, { receiverId: userId }],
        };

        const result = await TransactionModel.findAndCountAll({
            where,
            offset,
            limit: page,
            order: [['createdAt', 'DESC']],
        });

        return {
            items: result.rows,
            total: result.count,
            page,
            limit,
            totalPages: Math.ceil(Number(result.count) / limit),
        } as PaginatedTransactionsDto;
    }
}
