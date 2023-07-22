import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Key_Error } from 'src/common/constant/error';

@Injectable()
export class RoleAdmin implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (request.user?.role !== 'admin' && request.user?.role !== 'superadmin') {
      throw new UnauthorizedException(Key_Error.ONLY_ADMINS_HAVE_ACCESS);
    }

    return true;
  }
}
