import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class AdminOrMeGuard implements CanActivate {
    constructor(private jwtGuard: JwtAuthGuard) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const ok = await Promise.resolve(this.jwtGuard.canActivate(context));
        if (!ok) return false;

        const user = req.user;
        if (!user)
            throw new UnauthorizedException(
                'Missing user after token validation',
            );

        if (user.role === 'admin') return true;

        const params = req.params || {};
        const resourceId = params['id'];
        if (!resourceId) {
            throw new ForbiddenException(
                'Missing resource identifier for ownership check',
            );
        }

        if (user.sub !== resourceId) {
            throw new ForbiddenException(
                'You can only operate your own resource',
            );
        }

        return true;
    }
}
