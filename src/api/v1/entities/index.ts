import { ExtraInfoSchema } from './extra_info.entity';
import { MarriagePersonSchema } from './marriage_person.entity';
import { OtherPeopleSchema } from './other_people.entity';
import { PersonSchema } from './person.entity';

const entities = [
  PersonSchema,
  OtherPeopleSchema,
  MarriagePersonSchema,
  ExtraInfoSchema,
];
export default entities;
