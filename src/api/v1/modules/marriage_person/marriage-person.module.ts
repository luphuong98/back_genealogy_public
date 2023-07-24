import { Module } from '@nestjs/common';
import { MarriagePersonController } from './marriage-person.controller';
import { MarriagePersonService } from './marriage-person.service';
import { MarriagePersonRepository } from '@repositories//marriage_person.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MarriagePerson,
  MarriagePersonSchema,
} from '../../entities/marriage_person.entity';
import { PersonRepository } from '@repositories//person.repository';
import { Person, PersonSchema } from '../../entities/person.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MarriagePerson.name, schema: MarriagePersonSchema },
      { name: Person.name, schema: PersonSchema },
    ]),
  ],
  controllers: [MarriagePersonController],
  providers: [
    MarriagePersonService,
    {
      provide: 'MarriageRepositoryInterface',
      useClass: MarriagePersonRepository,
    },
    { provide: 'PersonRepositoryInterface', useClass: PersonRepository },
  ],
  exports: [MarriagePersonService],
})
export class MarriagePersonModule {}
