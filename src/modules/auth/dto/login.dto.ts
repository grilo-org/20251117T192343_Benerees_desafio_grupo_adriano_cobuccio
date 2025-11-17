import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: 'Email used to login',
        example: 'alice@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Plain text password', example: 'password123' })
    @IsString()
    password: string;
}
