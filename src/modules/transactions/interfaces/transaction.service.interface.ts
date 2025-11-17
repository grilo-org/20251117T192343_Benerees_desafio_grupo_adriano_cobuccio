import { TransactionResponseDto } from '../dto/transaction-response.dto';
import { PaginatedTransactionsDto } from '../dto/paginated-transactions.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export interface ITransactionService {
    transfer(
        senderId: string,
        receiverId: string,
        amountStr: string,
    ): Promise<TransactionResponseDto>;
    reverse(
        requestorId: string,
        transactionId: string,
    ): Promise<TransactionResponseDto>;
    listByUser(
        userId: string,
        paginationQuery: PaginationQueryDto,
    ): Promise<PaginatedTransactionsDto>;
}
