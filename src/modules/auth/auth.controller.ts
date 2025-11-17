import {
    Controller,
    Post,
    Body,
    UsePipes,
    ValidationPipe,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AdminGuard } from './admin.guard';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { ErrorResponseDto } from '../../common/dto/error-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @UseGuards(AdminGuard)
    @ApiBearerAuth('BearerAuth')
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: 201,
        description: 'User created',
        type: UserResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request',
        type: ErrorResponseDto,
    })
    async register(@Body() dto: RegisterDto) {
        const user = await this.authService.register(
            dto.name,
            dto.email,
            dto.password,
        );
        return { id: user.id, name: user.name, email: user.email };
    }

    @Post('login')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @ApiResponse({
        status: 200,
        description: 'Login success',
        type: TokenResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        type: ErrorResponseDto,
    })
    async login(@Body() dto: LoginDto) {
        const user = await this.authService.validateUser(
            dto.email,
            dto.password,
        );
        return this.authService.login(user);
    }
}
