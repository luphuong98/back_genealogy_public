import { BaseRepositoryInterface } from 'src/api/v1/repositories/base/base.interface.repository';
import { FindAllResponse } from 'src/api/v1/common/types/common.type';
import { OtherPeople } from 'src/api/v1/entities/other_people.entity';
export interface OtherPeopleRepositoryInterface
  extends BaseRepositoryInterface<OtherPeople> {
  findAllWithSubFields(
    condition: object,
    projection?: string,
    populate?: string[] | any,
  ): Promise<FindAllResponse<OtherPeople>>;
}
