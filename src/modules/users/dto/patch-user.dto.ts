import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, MinLength } from 'class-validator';

export class PatchUserDto {
    @ApiProperty({
        description: 'Full name of the user',
        required: false,
        example: 'Alice Silva',
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        description: 'Email address',
        required: false,
        example: 'alice@example.com',
    })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({
        description: 'New password (plain text). Minimum 6 characters',
        required: false,
        example: 'newpassword123',
    })
    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
}
