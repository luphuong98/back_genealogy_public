import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Expose } from 'class-transformer';
import { BaseEntity } from './base/base.entity';
import { RELATION } from '../common/shared/enum/relation.enum';
import { ExtraInfo, ExtraInfoSchema } from './extra_info.entity';
import { Person } from './person.entity';

export type OtherPeopleDocument = HydratedDocument<OtherPeople>;

@Schema()
export class OtherPeople extends BaseEntity {
  @Prop({
    type: RELATION,
  })
  relation: RELATION;

  @Prop({
    type: ExtraInfoSchema,
  })
  extra_info: ExtraInfo;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Person.name,
    required: true,
  })
  person: Person;
}

export const OtherPeopleSchema = SchemaFactory.createForClass(OtherPeople);
