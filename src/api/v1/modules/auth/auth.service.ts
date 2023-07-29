import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { Key_Error_User } from '../../common/helpers/responses';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entities/user.entity';
import { TokenPayload } from './interfaces/token.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@modules/user/user.service';
import { USER_ROLE } from '../../common/shared/enum/user-role.enum';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private SALT_ROUND = 11;
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async Register(registerDto: RegisterDto) {
    try {
      const existedUser = await this.userService.findOneByCondition({
        email: registerDto.email,
      });
      if (existedUser) {
        throw new ConflictException(Key_Error_User.EMAIL_ALREADY_EXISTS);
      }
      const hashed_password = await bcrypt.hash(
        registerDto.password,
        this.SALT_ROUND,
      );
      const user = await this.userService.create({
        ...registerDto,
        username: `${registerDto.email.split('@')[0]}${Math.floor(
          10 + Math.random() * (999 - 10),
        )}`, // Random username
        password: hashed_password,
        role: USER_ROLE.ADMIN,
      });
      const refresh_token = this.generateRefreshToken({
        user_id: user._id.toString(),
      });
      await this.storeRefreshToken(user._id.toString(), refresh_token);
      return {
        access_token: this.generateAccessToken({
          user_id: user._id.toString(),
        }),
        refresh_token,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAuthenticatedUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        throw new NotFoundException(Key_Error_User.USER_NOT_FOUND);
      }
      await this.verifyPlainContentWithHashedContent(password, user.password);
      return user;
    } catch (error) {
      throw new BadRequestException(Key_Error_User.WRONG_CREDENTIAL);
    }
  }
  private async verifyPlainContentWithHashedContent(
    plain_text: string,
    hashed_text: string,
  ) {
    const is_matching = await bcrypt.compare(plain_text, hashed_text);
    if (!is_matching) {
      throw new BadRequestException(Key_Error_User.PASSWORD_NOT_MATCH);
    }
  }

  generateAccessToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }
  generateRefreshToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }
  async storeRefreshToken(user_id: string, token: string): Promise<void> {
    try {
      const hashed_token = await bcrypt.hash(token, this.SALT_ROUND);
      await this.userService.setCurrentRefreshToken(user_id, hashed_token);
    } catch (error) {
      throw error;
    }
  }

  async logIn(user_id: string) {
    try {
      const access_token = this.generateAccessToken({
        user_id,
      });
      const refresh_token = this.generateRefreshToken({
        user_id,
      });
      await this.storeRefreshToken(user_id, refresh_token);
      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      throw error;
    }
  }
  async getUserIfRefreshTokenMatched(
    user_id: string,
    refresh_token: string,
  ): Promise<User> {
    try {
      const user = await this.userService.findOneByCondition({
        _id: user_id,
      });
      if (!user) {
        throw new UnauthorizedException();
      }
      await this.verifyPlainContentWithHashedContent(
        refresh_token,
        user.current_refresh_token,
      );
      return user;
    } catch (error) {
      throw error;
    }
  }
}
