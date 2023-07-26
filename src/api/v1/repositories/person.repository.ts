import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { Person, PersonDocument } from 'src/api/v1/entities/person.entity';
import { PersonRepositoryInterface } from '@modules/person/interfaces/person.interface';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, PopulateOptions } from 'mongoose';
import { FindAllResponse } from '../common/types/common.type';
import { ConditionPerson } from '@modules/person/interfaces/search.interface';

export type TObjectId = mongoose.ObjectId;
export const ObjectId = mongoose.Types.ObjectId;

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
  async findPersonWithOtherAndMarriage(
    condition?: ConditionPerson,
    page?: number,
    limit?: number,
  ): Promise<FindAllResponse<Person>> {
    let conditionPerson = {};
    if (condition._id) {
      conditionPerson = {
        ...conditionPerson,
        _id: new ObjectId(condition._id),
      };
    }
    let extraCondition = {};
    if (condition.full_name) {
      extraCondition = {
        ...extraCondition,
        full_name: { $regex: new RegExp(condition.full_name, 'i') },
      };
    }
    if (condition.phone_number) {
      conditionPerson = {
        ...conditionPerson,
        phone_number: {
          $regex: new RegExp(condition.phone_number, 'i'),
        },
      };
    }
    if (condition.email) {
      conditionPerson = {
        ...conditionPerson,
        email: { $regex: new RegExp(condition.email, 'i') },
      };
    }

    if (condition.address) {
      extraCondition = {
        ...extraCondition,
        'extra_info.address': {
          $regex: new RegExp(condition.address, 'i'),
        },
      };
    }
    // console.log('hung day ne', { conditionPerson, extraCondition });
    const [items, count] = await Promise.all([
      this.person_model.aggregate([
        {
          $match: conditionPerson,
        },
        {
          $lookup: {
            from: 'person',
            localField: 'parent',
            foreignField: '_id',
            as: 'parent',
          },
        },
        {
          $unwind: { path: '$parent', preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: 'person',
            localField: 'ancestors',
            foreignField: '_id',
            as: 'ancestors',
          },
        },
        {
          $addFields: {
            full_name: {
              $concat: ['$extra_info.first_name', ' ', '$extra_info.last_name'],
            },
            'parent.full_name': {
              $concat: [
                '$parent.extra_info.first_name',
                ' ',
                '$parent.extra_info.last_name',
              ],
            },
            birth_death_date: {
              $concat: ['$extra_info.birthday', '-', '$extra_info.dead_day'],
            },
          },
        },
        {
          $project: {
            _id: 1,
            full_name: 1,
            email: 1,
            phone_number: 1,
            extra_info: 1,
            parent: {
              $cond: {
                if: { $eq: ['$parent', []] },
                then: null,
                else: '$parent',
              },
            },
            ancestors: {
              $cond: {
                if: { $eq: ['$ancestors', []] },
                then: null,
                else: '$ancestors',
              },
            },
            birth_death_date: 1,
          },
        },
        {
          $match: extraCondition,
        },
        {
          $lookup: {
            from: 'other-people',
            let: { person_id: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$$person_id', { $toObjectId: '$person' }],
                  },
                },
              },
              {
                $addFields: {
                  full_name: {
                    $concat: [
                      '$extra_info.first_name',
                      ' ',
                      '$extra_info.last_name',
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  relation: 1,
                  extra_info: 1,
                  full_name: 1,
                },
              },
            ],
            as: 'other_people',
          },
        },
        {
          $lookup: {
            from: 'marriage-person',
            let: { person_id: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$$person_id', { $toObjectId: '$person' }],
                  },
                },
              },
              {
                $addFields: {
                  full_name: {
                    $concat: [
                      '$extra_info.first_name',
                      ' ',
                      '$extra_info.last_name',
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  relation: 1,
                  extra_info: 1,
                  full_name: 1,
                },
              },
            ],
            as: 'marriage_person',
          },
        },

        {
          $sort: { created_at: -1 },
        },
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: limit,
        },
      ]),
      this.person_model.aggregate([
        {
          $match: conditionPerson,
        },
        {
          $lookup: {
            from: 'person',
            localField: 'parent',
            foreignField: '_id',
            as: 'parent',
          },
        },
        {
          $unwind: { path: '$parent', preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: 'person',
            localField: 'ancestors',
            foreignField: '_id',
            as: 'ancestors',
          },
        },
        {
          $addFields: {
            full_name: {
              $concat: ['$extra_info.first_name', ' ', '$extra_info.last_name'],
            },
            'parent.full_name': {
              $concat: [
                '$parent.extra_info.first_name',
                ' ',
                '$parent.extra_info.last_name',
              ],
            },
            birth_death_date: {
              $concat: ['$extra_info.birthday', ' ', '$extra_info.dead_day'],
            },
          },
        },
        {
          $match: extraCondition,
        },
        {
          $project: {
            _id: 1,
            full_name: 1,
            email: 1,
            phone_number: 1,
            extra_info: 1,
            parent: {
              $cond: {
                if: { $eq: ['$parent', []] },
                then: null,
                else: '$parent',
              },
            },
            ancestors: {
              $cond: {
                if: { $eq: ['$ancestors', []] },
                then: null,
                else: '$ancestors',
              },
            },
            birth_death_date: 1,
          },
        },
        {
          $lookup: {
            from: 'other-people',
            let: { person_id: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$$person_id', { $toObjectId: '$person' }],
                  },
                },
              },
              {
                $addFields: {
                  full_name: {
                    $concat: [
                      '$extra_info.first_name',
                      ' ',
                      '$extra_info.last_name',
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  relation: 1,
                  extra_info: 1,
                  full_name: 1,
                },
              },
            ],
            as: 'other_people',
          },
        },
        {
          $lookup: {
            from: 'marriage-person',
            let: { person_id: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$$person_id', { $toObjectId: '$person' }],
                  },
                },
              },
              {
                $addFields: {
                  full_name: {
                    $concat: [
                      '$extra_info.first_name',
                      ' ',
                      '$extra_info.last_name',
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  relation: 1,
                  extra_info: 1,
                  full_name: 1,
                },
              },
            ],
            as: 'marriage_person',
          },
        },
        {
          $group: { _id: null, count: { $sum: 1 } },
        },
      ]),
    ]);

    return {
      count: count.length ? count[0].count : 0,
      items,
    };
  }
  async findAllShort() {
    const [count, items] = await Promise.all([
      this.person_model.count({ deleted_at: null }),
      this.person_model
        .find({ deleted_at: null })
        .sort({ created_at: -1 })
        .select('_id full_name birth_death_date email phone_number extra_info ')
        .exec(),
    ]);
    return {
      count,
      items,
    };
  }
}
