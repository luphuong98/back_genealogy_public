import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions } from 'mongoose';
import {
  MarriagePerson,
  MarriagePersonDocument,
} from '../entities/marriage_person.entity';
import { MarriagePersonRepositoryInterface } from '@modules/marriage_person/interfaces/marriage-person.interface';
import { FindAllResponse } from '../common/types/common.type';

@Injectable()
export class MarriagePersonRepository
  extends BaseRepositoryAbstract<MarriagePersonDocument>
  implements MarriagePersonRepositoryInterface
{
  constructor(
    @InjectModel(MarriagePerson.name)
    private readonly marriage_person_model: Model<MarriagePersonDocument>,
  ) {
    super(marriage_person_model);
  }
  async findAllWithSubFields(
    condition: FilterQuery<MarriagePersonDocument>,
    projection?: string,
    populate?: string[] | PopulateOptions | PopulateOptions[],
  ): Promise<FindAllResponse<MarriagePerson>> {
    const [count, items] = await Promise.all([
      this.marriage_person_model.count({ ...condition, deleted_at: null }),
      this.marriage_person_model
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
