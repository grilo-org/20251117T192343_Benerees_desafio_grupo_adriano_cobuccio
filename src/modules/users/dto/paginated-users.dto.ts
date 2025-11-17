import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';
import { PaginatedDto } from '../../../common/dto/paginated.dto';

export class PaginatedUsersDto extends PaginatedDto {
    @ApiProperty()
    declare items: UserResponseDto[];
}
