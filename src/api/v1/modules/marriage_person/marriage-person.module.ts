import { Module } from '@nestjs/common';
import { MarriagePersonController } from './marriage-person.controller';
import { MarriagePersonService } from './marriage-person.service';

@Module({
  controllers: [MarriagePersonController],
  providers: [MarriagePersonService],
})
export class MarriagePersonModule {}
