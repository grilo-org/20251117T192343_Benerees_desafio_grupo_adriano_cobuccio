import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class ListTransactionsQueryDto extends PaginationQueryDto {
    @ApiProperty({
        required: false,
        description: 'User id to list transactions for (admin only)',
    })
    @IsOptional()
    @IsUUID()
    userId?: string;
}
