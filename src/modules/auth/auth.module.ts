import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from '../../common/repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '../../common/sequelize/sequelize.module';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AdminGuard } from './admin.guard';
import { AdminOrMeGuard } from './admin-or-me.guard';

const jwtExpires = process.env.JWT_EXPIRES ?? '1h';

@Module({
    imports: [
        SequelizeModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'secret',
            signOptions: { expiresIn: jwtExpires as any },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        UserRepository,
        JwtAuthGuard,
        AdminGuard,
        AdminOrMeGuard,
    ],
    exports: [AuthService, JwtModule, JwtAuthGuard, AdminGuard, AdminOrMeGuard],
})
export class AuthModule {}
