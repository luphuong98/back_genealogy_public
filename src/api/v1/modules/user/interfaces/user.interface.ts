import { BaseRepositoryInterface } from '@repositories//base/base.interface.repository';
import { FindAllResponse } from 'src/api/v1/common/types/common.type';
import { User } from 'src/api/v1/entities/user.entity';

export interface UserRepositoryInterface extends BaseRepositoryInterface<User> {
  findAllWithSubFields(
    condition: object,
    projection?: string,
    populate?: string[] | any,
  ): Promise<FindAllResponse<User>>;
  getUserWithRole(user_id: string): Promise<User>;
}
