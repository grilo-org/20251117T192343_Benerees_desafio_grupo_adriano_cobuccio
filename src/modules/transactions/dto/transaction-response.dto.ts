import { ApiProperty } from '@nestjs/swagger';

export class TransactionResponseDto {
    @ApiProperty({
        format: 'uuid',
        description: 'Transaction id',
        example: 'd4c3b2a1-0f9e-8d7c-6b5a-43210fedcba9',
    })
    id: string;

    @ApiProperty({
        format: 'uuid',
        description: 'Sender user id',
        example: 'a3f5e8d2-4b6c-7d8e-9f01-23456789abcd',
    })
    senderId: string;

    @ApiProperty({
        format: 'uuid',
        description: 'Receiver user id',
        example: 'b3e1f9e2-6f6d-4f7a-8b2a-0c9a1d2e3f4b',
    })
    receiverId: string;

    @ApiProperty({
        example: '10.00',
        description: 'Amount transferred as decimal string',
    })
    amount: string;

    @ApiProperty({
        enum: ['pending', 'completed', 'reversed'],
        description: 'Transaction status',
    })
    status: string;
}
