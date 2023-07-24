import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions } from 'mongoose';
import { FindAllResponse } from '../common/types/common.type';
import {
  OtherPeople,
  OtherPeopleDocument,
} from '../entities/other_people.entity';
import { OtherPeopleRepositoryInterface } from '@modules/other_people/interfaces/other-people.interface';

@Injectable()
export class OtherPeopleRepository
  extends BaseRepositoryAbstract<OtherPeopleDocument>
  implements OtherPeopleRepositoryInterface
{
  constructor(
    @InjectModel(OtherPeople.name)
    private readonly other_people_model: Model<OtherPeopleDocument>,
  ) {
    super(other_people_model);
  }
  async findAllWithSubFields(
    condition: FilterQuery<OtherPeopleDocument>,
    projection?: string,
    populate?: string[] | PopulateOptions | PopulateOptions[],
  ): Promise<FindAllResponse<OtherPeople>> {
    const [count, items] = await Promise.all([
      this.other_people_model.count({ ...condition, deleted_at: null }),
      this.other_people_model
        .find({ ...condition, deleted_at: null }, projection)
        .sort({ created_at: -1 })
        .populate(populate),
    ]);
    return {
      count,
      items,
    };
  }
}
