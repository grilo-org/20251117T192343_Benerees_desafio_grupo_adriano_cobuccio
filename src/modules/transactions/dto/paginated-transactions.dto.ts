import { ApiProperty } from '@nestjs/swagger';
import { TransactionResponseDto } from './transaction-response.dto';
import { PaginatedDto } from '../../../common/dto/paginated.dto';

export class PaginatedTransactionsDto extends PaginatedDto {
    @ApiProperty()
    declare items: TransactionResponseDto[];
}
