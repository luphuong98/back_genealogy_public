import { Module } from '@nestjs/common';
import { OtherPeopleService } from './other_people.service';
import { OtherPeopleController } from './other_people.controller';

@Module({
  providers: [OtherPeopleService],
  controllers: [OtherPeopleController]
})
export class OtherPeopleModule {}
