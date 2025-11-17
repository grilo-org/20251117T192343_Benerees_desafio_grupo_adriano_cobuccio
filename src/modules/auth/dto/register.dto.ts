import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        description: 'Full name of the user',
        example: 'Alice Silva',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Unique email address of the user',
        example: 'alice@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password (plain text). Minimum 6 characters',
        example: 'password123',
    })
    @IsString()
    @MinLength(6)
    password: string;
}
