import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private jwtGuard: JwtAuthGuard) {}

    async canActivate(context: ExecutionContext) {
        const ok = await Promise.resolve(this.jwtGuard.canActivate(context));
        if (!ok) return false;

        const req = context.switchToHttp().getRequest();
        const user = req.user;
        if (!user)
            throw new UnauthorizedException(
                'Missing user after token validation',
            );
        if (user.role !== 'admin')
            throw new ForbiddenException('Admin role required');
        return true;
    }
}
