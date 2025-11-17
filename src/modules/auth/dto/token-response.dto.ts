import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description:
            'JWT access token to be used as Bearer token in Authorization header',
    })
    access_token: string;
}
