import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsUUID, Min, IsOptional, IsNumber } from 'class-validator';

export class TransferDto {
    @ApiProperty({
        description:
            'Optional sender user id (UUID). Only allowed when caller is admin',
        example: 'a3f5e8d2-4b6c-7d8e-9f01-23456789abcd',
        required: false,
    })
    @IsUUID()
    @IsOptional()
    senderId?: string;

    @ApiProperty({
        description: 'Receiver user id (UUID)',
        example: 'b3e1f9e2-6f6d-4f7a-8b2a-0c9a1d2e3f4b',
    })
    @IsUUID()
    receiverId: string;

    @ApiProperty({
        description: 'Amount to transfer (string decimal with 2 places)',
        example: 10.0,
    })
    @Type(() => Number)
    @IsNumber()
    @Min(0.01)
    amount: string;
}
