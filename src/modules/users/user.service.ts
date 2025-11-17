import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../../common/repositories/user.repository';
import { IUserService } from './interfaces/user.service.interface';
import { PatchUserDto } from './dto/patch-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginatedUsersDto } from './dto/paginated-users.dto';
import * as bcrypt from 'bcrypt';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class UserService implements IUserService {
    constructor(private userRepository: UserRepository) {}

    async getProfile(userId: string): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async findById(id: string): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async list(
        paginationQuery: PaginationQueryDto,
    ): Promise<PaginatedUsersDto> {
        return await this.userRepository.findAll(paginationQuery);
    }

    async update(id: string, dto: PatchUserDto): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (dto.email && dto.email !== user.email) {
            const emailExists = await this.userRepository.findByEmail(
                dto.email,
            );
            if (emailExists) {
                throw new ConflictException('Email already registered');
            }
        }

        const updateData = { ...dto };
        if (dto.password) {
            updateData.password = await bcrypt.hash(dto.password, 10);
        }

        const updated = await this.userRepository.update(user, updateData);
        return updated;
    }

    async softDelete(id: string): Promise<{ id: string }> {
        const deleted = await this.userRepository.softDelete(id);
        if (!deleted) {
            throw new NotFoundException('User not found');
        }
        return { id: deleted.id };
    }

    async restore(id: string): Promise<{ id: string; restoredAt: Date }> {
        const restored = await this.userRepository.restore(id);
        if (!restored) {
            throw new NotFoundException('User not found');
        }
        return { id: restored.id, restoredAt: restored.updatedAt };
    }
}
