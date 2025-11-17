import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
    @ApiProperty({ example: 400 })
    statusCode: number;

    @ApiProperty({ example: 'Bad Request' })
    error: string;

    @ApiProperty({ example: ['details about what failed'], type: [String] })
    message?: any;
}
