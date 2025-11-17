import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { SequelizeModule } from './common/sequelize/sequelize.module';
import { AuthModule } from './modules/auth/auth.module';
import { TransactionModule } from './modules/transactions/transaction.module';
import { UserModule } from './modules/users/user.module';
import { LoggingModule } from './common/logging/logging.module';

@Module({
    imports: [
        SequelizeModule,
        AuthModule,
        TransactionModule,
        UserModule,
        LoggingModule,
    ],
    controllers: [HealthController],
})
export class AppModule {}
