import { TokenResponseDto } from '../dto/token-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { User } from '../../../common/models/user.model';

export interface IAuthService {
    register(
        name: string,
        email: string,
        password: string,
    ): Promise<UserResponseDto>;
    validateUser(email: string, password: string): Promise<UserResponseDto>;
    login(user: User): Promise<TokenResponseDto>;
}
