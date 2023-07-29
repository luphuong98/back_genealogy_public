import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions } from 'mongoose';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { User, UserDocument } from '../entities/user.entity';
import { UserRepositoryInterface } from '@modules/user/interfaces/user.interface';
import { FindAllResponse } from '../common/types/common.type';

@Injectable()
export class UserRepository
  extends BaseRepositoryAbstract<UserDocument>
  implements UserRepositoryInterface
{
  constructor(
    @InjectModel(User.name)
    private readonly user_model: Model<UserDocument>,
  ) {
    super(user_model);
  }

  async findAllWithSubFields(
    condition: FilterQuery<UserDocument>,
    projection?: string,
    populate?: string[] | PopulateOptions | PopulateOptions[],
  ): Promise<FindAllResponse<UserDocument>> {
    const [count, items] = await Promise.all([
      this.user_model.count({ ...condition, deleted_at: null }),
      this.user_model
        .find({ ...condition, deleted_at: null }, projection)
        .populate(populate),
    ]);
    return {
      count,
      items,
    };
  }

  async getUserWithRole(user_id: string): Promise<User> {
    return await this.user_model.findById(user_id, '-password');
    // .populate([{ path: 'role', transform: (role: UserRole) => role?.name }]);
  }
}
