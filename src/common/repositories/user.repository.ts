import { Injectable, Inject } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user.model';
import { PaginationQueryDto } from '../dto/pagination-query.dto';

@Injectable()
export class UserRepository {
    constructor(@Inject('SEQUELIZE') private readonly sequelize: Sequelize) {}

    async findById(id: string) {
        return User.findByPk(id);
    }

    async findByEmail(email: string) {
        return User.findOne({ where: { email } });
    }

    async create(payload: User) {
        return User.create(payload);
    }

    async update(user: User, payload: Partial<User>) {
        return user.update(payload);
    }

    async findAll(paginationQuery: PaginationQueryDto) {
        const page =
            Number(paginationQuery.page) > 0 ? Number(paginationQuery.page) : 1;
        const limit =
            Number(paginationQuery.limit) > 0
                ? Number(paginationQuery.limit)
                : 10;
        const offset = (page - 1) * limit;

        const result = await User.findAndCountAll({
            offset,
            limit,
            order: [['createdAt', 'DESC']],
        });

        return {
            items: result.rows,
            total: result.count,
            page,
            limit,
            totalPages: Math.ceil(Number(result.count) / limit),
        };
    }

    async softDelete(id: string) {
        const user = await User.findByPk(id);
        if (!user) return null;
        await user.destroy();
        return user;
    }

    async restore(id: string) {
        const user = await User.findByPk(id, { paranoid: false });
        if (!user) return null;
        await user.restore();
        return user;
    }
}
