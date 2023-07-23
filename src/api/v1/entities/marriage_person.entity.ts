import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity } from './base/base.entity';
import { ExtraInfo } from './extra_info.entity';
import { Person } from './person.entity';
import { Type } from 'class-transformer';

export type MarriagePersonDocument = HydratedDocument<MarriagePerson>;

@Schema({
  collection: 'marriage-person',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class MarriagePerson extends BaseEntity {
  @Prop()
  relation: string;

  @Prop({
    type: ExtraInfo,
  })
  @Type(() => ExtraInfo)
  extra_info: ExtraInfo;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
    required: true,
  })
  person: Person;
}

export const MarriagePersonSchema =
  SchemaFactory.createForClass(MarriagePerson);
