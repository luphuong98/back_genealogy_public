import { Module } from '@nestjs/common';
import { OtherPeopleService } from './other_people.service';
import { OtherPeopleController } from './other_people.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OtherPeople,
  OtherPeopleSchema,
} from '../../entities/other_people.entity';
import { OtherPeopleRepository } from '@repositories//other_people.repository';
import { PersonModule } from '@modules/person/person.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OtherPeople.name, schema: OtherPeopleSchema },
    ]),
    PersonModule,
  ],
  providers: [
    OtherPeopleService,
    {
      provide: 'OtherPeopleRepositoryInterface',
      useClass: OtherPeopleRepository,
    },
  ],
  controllers: [OtherPeopleController],
  exports: [OtherPeopleService],
})
export class OtherPeopleModule {}
