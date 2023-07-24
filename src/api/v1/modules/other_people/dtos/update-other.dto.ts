import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateOtherDto } from './create-other.dto';

export class UpdateOtherDto extends PartialType(
  OmitType(CreateOtherDto, ['relation', 'extra_info', 'person'] as const),
) {}
