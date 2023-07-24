import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { Person, PersonDocument } from 'src/api/v1/entities/person.entity';
import { PersonRepositoryInterface } from '@modules/person/interfaces/person.interface';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions } from 'mongoose';
import { FindAllResponse, FindOneResponse } from '../common/types/common.type';

@Injectable()
export class PersonRepository
  extends BaseRepositoryAbstract<PersonDocument>
  implements PersonRepositoryInterface
{
  constructor(
    @InjectModel(Person.name)
    private readonly person_model: Model<PersonDocument>,
  ) {
    super(person_model);
  }
  findOneWithSubFields(
    condition: object,
    populate?: any,
  ): Promise<FindOneResponse<Person>> {
    throw new Error('Method not implemented.');
  }
  async findAllWithSubFields(
    condition: FilterQuery<PersonDocument>,
    projection?: string,
    populate?: string[] | PopulateOptions | PopulateOptions[],
  ): Promise<FindAllResponse<Person>> {
    const [count, items] = await Promise.all([
      this.person_model.count({ ...condition, deleted_at: null }),
      this.person_model
        .find({ ...condition, deleted_at: null }, projection)
        .sort({ created_at: -1 })
        .populate(populate),
    ]);
    return {
      count,
      items,
    };
  }

  // async findOneWithSubFields(
  //   condition: FilterQuery<PersonDocument>,
  //   populate?: string[] | PopulateOptions | PopulateOptions[],
  // ): Promise<Person> {

  // }
}
