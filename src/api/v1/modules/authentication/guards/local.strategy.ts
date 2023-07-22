import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const admin = await this.authService.validateAdmin(email, password);
    if (!admin) {
      throw new UnauthorizedException();
    }

    const account = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role.role,
    };

    return account;
  }
}

@Injectable()
export class LocalCustomerStrategy extends PassportStrategy(
  Strategy,
  'customer',
) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string): Promise<any> {
    const customer = await this.authService.validateCustomer(email, password);
    if (!customer) {
      throw new UnauthorizedException();
    }

    const account = {
      id: customer.id,
      email: customer.email,
      name: customer.name,
      is_active: customer?.is_active,
    };

    return account;
  }
}
