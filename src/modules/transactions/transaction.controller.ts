import {
    Controller,
    Post,
    Body,
    UsePipes,
    ValidationPipe,
    UseGuards,
    Req,
    NotFoundException,
    Get,
    Query,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransferDto } from './dto/transfer.dto';
import { ReverseDto } from './dto/reverse.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
    ApiTags,
    ApiBearerAuth,
    ApiResponse,
    ApiHeader,
    ApiQuery,
} from '@nestjs/swagger';
import { ListTransactionsQueryDto } from './dto/list-transactions.query.dto';
import { PaginatedTransactionsDto } from './dto/paginated-transactions.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { ErrorResponseDto } from '../../common/dto/error-response.dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
    constructor(private transactionService: TransactionService) {}

    @Post('transfer')
    @ApiBearerAuth('BearerAuth')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @ApiResponse({
        status: 201,
        description: 'Transaction created',
        type: TransactionResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: 409,
        description: 'Conflict (insufficient funds)',
        type: ErrorResponseDto,
    })
    async transfer(@Req() req: any, @Body() dto: TransferDto) {
        const me = req.user;
        let senderId = me?.sub;
        if (dto.senderId) {
            if (!me || me.role !== 'admin') {
                throw new ForbiddenException('Only admin can specify senderId');
            }
            senderId = dto.senderId;
        }

        const transactionTransferData: TransactionResponseDto =
            await this.transactionService.transfer(
                senderId,
                dto.receiverId,
                dto.amount,
            );
        if (!transactionTransferData)
            throw new NotFoundException('Transaction not created');
        return {
            id: transactionTransferData.id,
            status: transactionTransferData.status,
        };
    }

    @Get()
    @ApiBearerAuth('BearerAuth')
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        example: 1,
        description: 'Page number (default 1)',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        example: 10,
        description: 'Page size (default 10)',
    })
    @ApiQuery({
        name: 'userId',
        required: false,
        description: 'User id to list transactions for (admin only)',
    })
    @ApiResponse({
        status: 200,
        description: 'List of user transactions (paginated)',
        type: PaginatedTransactionsDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        type: ErrorResponseDto,
    })
    @UseGuards(JwtAuthGuard)
    async listMyTransactions(
        @Req() req: any,
        @Query() q: ListTransactionsQueryDto,
    ) {
        const me = req.user;

        const { page, limit, userId } = q;

        let userIdToList = me.sub;
        if (userId) {
            if (me.role !== 'admin')
                throw new ForbiddenException(
                    'Only admin can list other users transactions',
                );
            userIdToList = userId;
        }

        const result = await this.transactionService.listByUser(userIdToList, {
            page,
            limit,
        });
        return result;
    }

    @Post('reverse')
    @ApiBearerAuth('BearerAuth')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @ApiResponse({
        status: 200,
        description: 'Transaction reversed',
        type: TransactionResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Transaction not found',
        type: ErrorResponseDto,
    })
    async reverse(@Req() req: any, @Body() dto: ReverseDto) {
        const me = req.user;
        if (!me) throw new BadRequestException('Authentication required');
        const requestorId = me.sub;
        const transactionReverseData: TransactionResponseDto =
            await this.transactionService.reverse(
                requestorId,
                dto.transactionId,
            );
        if (!transactionReverseData)
            throw new NotFoundException('Transaction not found');
        return {
            id: transactionReverseData.id,
            status: transactionReverseData.status,
        };
    }
}
