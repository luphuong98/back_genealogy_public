import { BaseRepositoryInterface } from 'src/api/v1/repositories/base/base.interface.repository';
import { Person } from '../../../entities/person.entity';
import { FindAllResponse } from 'src/api/v1/common/types/common.type';

export interface PersonRepositoryInterface
  extends BaseRepositoryInterface<Person> {
  findAllWithSubFields(
    condition: object,
    projection?: string,
    populate?: string[] | any,
  ): Promise<FindAllResponse<Person>>;
}