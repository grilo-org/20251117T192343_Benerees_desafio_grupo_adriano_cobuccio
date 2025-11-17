import { Module } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';
import { JwtModule } from '@nestjs/jwt';

const jwtExpires = process.env.JWT_EXPIRES ?? '1h';

@Module({
    providers: [LoggingInterceptor],
    exports: [LoggingInterceptor],
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'secret',
            signOptions: { expiresIn: jwtExpires as any },
        }),
    ],
})
export class LoggingModule {}
