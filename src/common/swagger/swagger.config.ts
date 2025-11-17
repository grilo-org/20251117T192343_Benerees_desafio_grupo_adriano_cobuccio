import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
    .setTitle('Digital Wallet API')
    .setDescription(
        'API para gerenciamento de carteira digital — usuários, saldo e transferências',
    )
    .setVersion('0.1')
    .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'BearerAuth',
    )
    .addTag('wallet')
    .build();
