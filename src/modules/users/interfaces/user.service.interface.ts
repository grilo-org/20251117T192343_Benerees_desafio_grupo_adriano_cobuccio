import { PatchUserDto } from '../dto/patch-user.dto';
import { PaginatedUsersDto } from '../dto/paginated-users.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export interface IUserService {
    getProfile(userId: string): Promise<UserResponseDto>;
    findById(id: string): Promise<UserResponseDto>;
    list(paginationQuery: PaginationQueryDto): Promise<PaginatedUsersDto>;
    update(id: string, data: PatchUserDto): Promise<UserResponseDto>;
    softDelete(id: string): Promise<{ id: string }>;
    restore(id: string): Promise<{ id: string; restoredAt: Date }>;
}
