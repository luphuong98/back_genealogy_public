import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Exclude } from 'class-transformer';
import { BaseEntity } from './base/base.entity';
import { GENDER } from '../common/shared/enum/gender.enum';
import { USER_ROLE } from '../common/shared/enum/user-role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  collection: 'user',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class User extends BaseEntity {
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

  @Prop({
    required: true,
    unique: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  })
  email: string;

  @Prop({
    match: /^([+]\d{2})?\d{10}$/,
    get: (phone_number: string) => {
      if (!phone_number) {
        return;
      }
      const last_four_digits = phone_number.slice(phone_number.length - 4);
      return `***-***-${last_four_digits}`;
    },
  })
  phone_number: string;

  @Prop({
    required: true,
    unique: true,
  })
  username: string;

  @Exclude()
  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    default:
      'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
  })
  avatar: string;

  @Prop({
    default: '',
  })
  birthday: string;

  @Prop({
    enum: GENDER,
    default: GENDER.OTHER,
  })
  gender: GENDER;

  @Prop({
    enum: USER_ROLE,
    default: USER_ROLE.USER,
  })
  role: USER_ROLE;

  @Prop({
    type: [
      {
        type: String,
      },
    ],
  })
  address: string[];

  @Prop()
  @Exclude()
  current_refresh_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('full_name').get(function (this: UserDocument) {
  return `${this.first_name} ${this.last_name}`;
});
