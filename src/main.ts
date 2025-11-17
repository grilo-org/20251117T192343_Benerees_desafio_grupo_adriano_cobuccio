import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { swaggerConfig } from './common/swagger/swagger.config';
import { SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/logging/logging.interceptor';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    const jwtService = new JwtService({
        secret: process.env.JWT_SECRET || 'secret',
    });
    app.useGlobalInterceptors(new LoggingInterceptor(jwtService));
    const doc = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, doc, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    await app.listen(80);
}
bootstrap();
