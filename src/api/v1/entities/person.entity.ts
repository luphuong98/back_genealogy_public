import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { Expose } from 'class-transformer';
import { BaseEntity } from './base/base.entity';
import { ExtraInfo, ExtraInfoSchema } from './extra_info.entity';
import { OtherPeopleDocument } from './other_people.entity';
import { MarriagePerson } from './marriage_person.entity';
import { NextFunction } from 'express';

export type PersonDocument = HydratedDocument<Person>;

@Schema({
  toJSON: {
    getters: true,
    // virtuals: true,
  },
})
export class Person extends BaseEntity {
  @Prop({
    required: true,
    unique: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  })
  // @Expose({ name: 'mail', toPlainOnly: true })
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
    type: ExtraInfoSchema,
  })
  extra_info: ExtraInfo;

  @Prop({
    default:
      'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
  })
  image: string;

  // @Prop({
  //   type: [{ type: mongoose.Schema.Types.ObjectId, ref: OtherPeople.name }],
  // })
  // other_people: OtherPeople[];

  // @Prop({
  //   type: [{ type: mongoose.Schema.Types.ObjectId, ref: MarriagePeople.name }],
  // })
  // marriage_person: MarriagePeople[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Person.name }],
    default: null,
  })
  ancestors: Person[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Person.name }],
    default: null,
  })
  parent: Person;
}

const PersonSchema = SchemaFactory.createForClass(Person);
PersonSchema.index({ email: 1, phone_number: 1 }, { unique: true });
export { PersonSchema };

// PersonSchema.virtual('extra_info')

export const PersonSchemaFactory = (
  other_people_model: Model<OtherPeopleDocument>,
  marriage_person_model: Model<MarriagePerson>,
) => {
  const person_schema = PersonSchema;
  person_schema.pre('findOneAndDelete', async function (next: NextFunction) {
    // OTHER USEFUL METHOD: getOptions, getPopulatedPaths, getQuery = getFilter, getUpdate
    const person = await this.model.findOne(this.getFilter());
    await Promise.all([
      other_people_model
        .deleteMany({
          person: person._id,
        })
        .exec(),
      marriage_person_model
        .deleteMany({
          person: person._id,
        })
        .exec(),
    ]);
    return next();
  });

  // user_schema.virtual('default_address').get(function (this: UserDocument) {
  //   if (this.address.length) {
  //     return `${(this.address[0].street && ' ') || ''}${this.address[0].city} ${
  //       this.address[0].state
  //     } ${this.address[0].country}`;
  //   }
  // });
  return person_schema;
};
