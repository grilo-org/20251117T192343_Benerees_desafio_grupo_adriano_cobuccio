import { Module } from '@nestjs/common';
import { databaseProvider } from './provider/sequelize.provider';

@Module({
    providers: [...databaseProvider],
    exports: [...databaseProvider],
})
export class SequelizeModule {}
