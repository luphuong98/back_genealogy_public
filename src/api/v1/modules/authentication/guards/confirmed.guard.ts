import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Key_Error } from 'src/common/constant/error';

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (!request.user?.is_active) {
      throw new UnauthorizedException(Key_Error.CONFIRM_YOUR_EMAIL_FIRST);
    }
    if (request.user?.role === 'admin' || request.user?.role === 'superadmin') {
      throw new UnauthorizedException(Key_Error.ONLY_CUSTOMER_HAVE_ACCESS);
    }

    return true;
  }
}
