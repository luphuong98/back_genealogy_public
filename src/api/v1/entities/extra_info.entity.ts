import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Expose } from 'class-transformer';
import { BaseEntity } from './base/base.entity';
import { GENDER } from '../common/shared/enum/gender.enum';

export type ExtraInfoDocument = HydratedDocument<ExtraInfo>;

@Schema({
  collection: 'extra-information',
})
export class ExtraInfo extends BaseEntity {
  @Prop({
    required: true,
    minlength: 2,
    maxlength: 60,
    set: (first_name: string) => {
      return first_name.trim();
    },
  })
  first_name: string;

  @Prop({
    required: true,
    minlength: 2,
    maxlength: 60,
    set: (last_name: string) => {
      return last_name.trim();
    },
  })
  last_name: string;

  @Prop()
  birthday: Date;

  @Prop()
  dead_day: Date;

  @Prop({
    enum: GENDER,
    default: GENDER.OTHER,
  })
  gender: GENDER;

  @Prop({
    default: '',
  })
  birth_place: string;

  @Prop({
    default: '',
  })
  burial_place: string;

  @Prop({
    default: '',
  })
  address: string;

  @Prop({
    default: '',
  })
  note: Text;

  @Expose({ name: 'full_name' })
  get fullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }
}

const ExtraInfoSchema = SchemaFactory.createForClass(ExtraInfo);
ExtraInfoSchema.index({ first_name: 1, last_name: 1 });
export { ExtraInfoSchema };
