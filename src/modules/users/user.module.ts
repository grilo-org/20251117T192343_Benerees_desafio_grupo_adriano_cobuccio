import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '../../common/sequelize/sequelize.module';
import { AuthModule } from '../auth/auth.module';
import { UserRepository } from '../../common/repositories/user.repository';

@Module({
    imports: [SequelizeModule, AuthModule],
    controllers: [UserController],
    providers: [UserService, UserRepository],
})
export class UserModule {}
