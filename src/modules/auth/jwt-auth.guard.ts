import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../common/repositories/user.repository';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private userRepository: UserRepository,
    ) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers['authorization'];
        if (!authHeader) throw new UnauthorizedException('Missing token');
        const parts = authHeader.split(' ');
        if (parts.length !== 2)
            throw new UnauthorizedException('Malformed token');
        const token = parts[1];
        try {
            const payload = this.jwtService.verify(token);
            const userExists = await this.userRepository.findById(payload.sub);
            if (!userExists) {
                throw new UnauthorizedException('User no longer exists');
            }
            req.user = payload;
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
