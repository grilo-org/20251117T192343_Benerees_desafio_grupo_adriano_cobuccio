import { Module } from '@nestjs/common';
import { SequelizeModule } from '../../common/sequelize/sequelize.module';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { AuthModule } from '../auth/auth.module';
import { TransactionRepository } from '../../common/repositories/transaction.repository';
import { UserRepository } from '../../common/repositories/user.repository';

@Module({
    imports: [SequelizeModule, AuthModule],
    controllers: [TransactionController],
    providers: [TransactionService, TransactionRepository, UserRepository],
})
export class TransactionModule {}
