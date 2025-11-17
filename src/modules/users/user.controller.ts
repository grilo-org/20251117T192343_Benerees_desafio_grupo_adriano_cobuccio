import {
    Controller,
    Get,
    Req,
    UseGuards,
    NotFoundException,
    Param,
    Patch,
    Body,
    UsePipes,
    ValidationPipe,
    Delete,
    Post,
    Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { AdminOrMeGuard } from '../auth/admin-or-me.guard';
import { PatchUserDto } from './dto/patch-user.dto';
import {
    ApiTags,
    ApiBearerAuth,
    ApiQuery,
    ApiResponse,
    ApiHeader,
} from '@nestjs/swagger';
import { PaginatedUsersDto } from './dto/paginated-users.dto';
import { ListUsersQueryDto } from './dto/list-users.query.dto';
import { ErrorResponseDto } from '../../common/dto/error-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('me')
    @ApiBearerAuth('BearerAuth')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 200, type: UserResponseDto })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        type: ErrorResponseDto,
    })
    async getProfile(@Req() req: any): Promise<UserResponseDto> {
        return this.userService.getProfile(req.user.sub);
    }

    @Get()
    @ApiBearerAuth('BearerAuth')
    @UseGuards(AdminGuard)
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
    @ApiResponse({
        status: 200,
        description: 'List of users (paginated)',
        type: PaginatedUsersDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        type: ErrorResponseDto,
    })
    async list(@Query() q: ListUsersQueryDto): Promise<PaginatedUsersDto> {
        const { page, limit } = q;
        return this.userService.list({ page, limit });
    }

    @Get(':id')
    @ApiBearerAuth('BearerAuth')
    @UseGuards(AdminGuard)
    @ApiResponse({ status: 200, type: UserResponseDto })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
        type: ErrorResponseDto,
    })
    async findById(@Param('id') id: string): Promise<UserResponseDto> {
        return this.userService.findById(id);
    }

    @Patch(':id')
    @ApiBearerAuth('BearerAuth')
    @UseGuards(AdminOrMeGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @ApiResponse({ status: 200, type: UserResponseDto })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
        type: ErrorResponseDto,
    })
    async update(
        @Req() req: any,
        @Param('id') id: string,
        @Body() dto: PatchUserDto,
    ): Promise<UserResponseDto> {
        return this.userService.update(id, dto);
    }

    @Delete(':id')
    @ApiBearerAuth('BearerAuth')
    @UseGuards(AdminOrMeGuard)
    @ApiResponse({ status: 200, type: Object })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
        type: ErrorResponseDto,
    })
    async softDelete(
        @Req() req: any,
        @Param('id') id: string,
    ): Promise<{ id: string }> {
        return this.userService.softDelete(id);
    }

    @Post(':id/restore')
    @ApiBearerAuth('BearerAuth')
    @UseGuards(AdminGuard)
    @ApiResponse({ status: 200, type: Object })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
        type: ErrorResponseDto,
    })
    async restore(
        @Param('id') id: string,
    ): Promise<{ id: string; restoredAt: Date }> {
        return this.userService.restore(id);
    }
}
