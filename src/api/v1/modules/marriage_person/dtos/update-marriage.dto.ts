import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateMarriageDto } from './create-marriage.dto';

export class UpdateMarriageDto extends PartialType(
  OmitType(CreateMarriageDto, ['relation', 'extra_info', 'person'] as const),
) {}
