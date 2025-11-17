import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ReverseDto {
    @ApiProperty({
        description: 'Transaction id to reverse (UUID)',
        example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    })
    @IsUUID()
    transactionId: string;
}
