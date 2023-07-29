import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseServiceAbstract } from '../../services/base/base.abstract.service';
import { User } from '../../entities/user.entity';
import { UserRepositoryInterface } from './interfaces/user.interface';
import { CreateUserDto } from './dtos/create-user.dto';
import {
  Key_Error_Person,
  Key_Error_User,
} from '../../common/helpers/responses';
import { USER_ROLE } from '../../common/shared/enum/user-role.enum';
import { FindAllResponse } from '../../common/types/common.type';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService extends BaseServiceAbstract<User> {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {
    super(userRepository);
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    const checkEmail = await this.userRepository.findOneByCondition({
      email: createUserDto.email,
    });
    if (checkEmail) {
      throw new BadRequestException(Key_Error_Person.EMAIL_ALREADY_EXISTS);
    }
    const checkUserName = await this.userRepository.findOneByCondition({
      username: createUserDto.username,
    });
    if (checkUserName) {
      throw new BadRequestException(Key_Error_User.USERNAME_ALREADY_EXISTS);
    }
    const user = await this.userRepository.create(createUserDto);
    if (!user) {
      throw new BadRequestException(Key_Error_User.CANNOT_CREATE_USER);
    }
    return user;
  }

  async findAll(
    filter?: object,
    projection?: string,
  ): Promise<FindAllResponse<User>> {
    return await this.userRepository.findAllWithSubFields(
      filter,
      projection,
      'role',
    );
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneByCondition({ email });
      if (!user) {
        throw new NotFoundException(Key_Error_User.USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
  async getUserWithRole(user_id: string): Promise<User> {
    try {
      return await this.userRepository.getUserWithRole(user_id);
    } catch (error) {
      throw error;
    }
  }

  async setCurrentRefreshToken(
    id: string,
    hashed_token: string,
  ): Promise<void> {
    try {
      await this.userRepository.update(id, {
        current_refresh_token: hashed_token,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto, email: string) {
    const checkUser = await this.userRepository.findOneById(id);
    if (!checkUser) {
      throw new BadRequestException(Key_Error_User.USER_NOT_FOUND);
    }
    const checkEmail = await this.userRepository.findOneByCondition({
      email,
      _id: { $nin: id },
    });
    if (checkEmail) {
      throw new BadRequestException(Key_Error_Person.EMAIL_ALREADY_EXISTS);
    }
    const checkUserName = await this.userRepository.findOneByCondition({
      username: updateUserDto.username,
    });
    if (checkUserName) {
      throw new BadRequestException(Key_Error_User.USERNAME_ALREADY_EXISTS);
    }
    const user = await this.userRepository.update(id, updateUserDto);
    if (!user) {
      throw new BadRequestException(Key_Error_User.CANNOT_UPDATE_USER);
    }
    return user;
  }
}
