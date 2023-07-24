import { BaseRepositoryInterface } from 'src/api/v1/repositories/base/base.interface.repository';
import { MarriagePerson } from 'src/api/v1/entities/marriage_person.entity';
import { FindAllResponse } from 'src/api/v1/common/types/common.type';
export interface MarriagePersonRepositoryInterface
  extends BaseRepositoryInterface<MarriagePerson> {
  findAllWithSubFields(
    condition: object,
    projection?: string,
    populate?: string[] | any,
  ): Promise<FindAllResponse<MarriagePerson>>;
}
