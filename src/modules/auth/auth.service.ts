import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../common/repositories/user.repository';
import { User } from '../../common/models/user.model';

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    async register(name: string, email: string, password: string) {
        const exists = await this.userRepository.findByEmail(email);
        if (exists) throw new ConflictException('Email already registered');
        const hashed = await bcrypt.hash(password, 10);
        const user = await this.userRepository.create({
            name,
            email,
            password: hashed,
            balance: '0.00',
        } as User);
        return user;
    }

    async validateUser(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) throw new UnauthorizedException('Invalid credentials');
        return user;
    }

    async login(user: User) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role || 'user',
        };
        return { access_token: this.jwtService.sign(payload) };
    }
}
