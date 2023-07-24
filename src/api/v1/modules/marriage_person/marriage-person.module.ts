import { Module } from '@nestjs/common';
import { MarriagePersonController } from './marriage-person.controller';
import { MarriagePersonService } from './marriage-person.service';
import { MarriagePersonRepository } from '@repositories//marriage_person.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MarriagePerson,
  MarriagePersonSchema,
} from '../../entities/marriage_person.entity';
import { PersonModule } from '@modules/person/person.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MarriagePerson.name, schema: MarriagePersonSchema },
    ]),
    PersonModule,
  ],
  controllers: [MarriagePersonController],
  providers: [
    MarriagePersonService,
    {
      provide: 'MarriageRepositoryInterface',
      useClass: MarriagePersonRepository,
    },
  ],
  exports: [MarriagePersonService],
})
export class MarriagePersonModule {}
