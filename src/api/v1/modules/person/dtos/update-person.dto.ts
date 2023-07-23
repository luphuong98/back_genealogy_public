import { CreatePersonDto } from './create-person.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export class UpdatePersonDto extends PartialType(
  OmitType(CreatePersonDto, ['email', 'phone_number', 'extra_info'] as const),
) {}
