import { Module } from '@nestjs/common';
import { PersonController } from './person.controller';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Person, PersonSchemaFactory } from '../../entities/person.entity';
import {
  OtherPeople,
  OtherPeopleSchema,
} from '../../entities/other_people.entity';
import {
  MarriagePerson,
  MarriagePersonSchema,
} from '../../entities/marriage_person.entity';
import { PersonService } from './person.service';
import { PersonRepository } from '../../repositories/person.repository';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Person.name,
        useFactory: PersonSchemaFactory,
        inject: [
          getModelToken(OtherPeople.name),
          getModelToken(MarriagePerson.name),
        ],
        imports: [
          MongooseModule.forFeature([
            { name: OtherPeople.name, schema: OtherPeopleSchema },
            { name: MarriagePerson.name, schema: MarriagePersonSchema },
          ]),
        ],
      },
    ]),
  ],
  controllers: [PersonController],
  providers: [
    PersonService,
    { provide: 'PersonRepositoryInterface', useClass: PersonRepository },
  ],
  exports: [PersonService],
})
export class PersonModule {}
