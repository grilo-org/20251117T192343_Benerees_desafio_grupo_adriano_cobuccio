import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
    @ApiProperty({
        format: 'uuid',
        description: 'User id (UUID)',
        example: 'a3f5e8d2-4b6c-7d8e-9f01-23456789abcd',
    })
    id: string;

    @ApiProperty({
        description: 'Full name of the user',
        example: 'Alice Silva',
    })
    name: string;

    @ApiProperty({
        description: 'Email address of the user',
        example: 'alice@example.com',
    })
    email: string;

    @ApiProperty({
        description: 'Current balance as decimal string',
        example: '0.00',
    })
    balance: string;
}
