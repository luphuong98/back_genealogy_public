import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity } from './base/base.entity';
import { ExtraInfo } from './extra_info.entity';
import { Person } from './person.entity';

export type OtherPeopleDocument = HydratedDocument<OtherPeople>;

@Schema({
  collection: 'other-people',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class OtherPeople extends BaseEntity {
  @Prop({ default: '' })
  relation: string;

  @Prop({
    type: ExtraInfo,
  })
  extra_info: ExtraInfo;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
    required: true,
  })
  person: Person;
}

export const OtherPeopleSchema = SchemaFactory.createForClass(OtherPeople);

OtherPeopleSchema.virtual('full_name').get(function (
  this: OtherPeopleDocument,
) {
  return `${this.extra_info.first_name} ${this.extra_info.last_name}`;
});
