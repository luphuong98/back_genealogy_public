import { CreateInfoDto } from '@modules/person/dtos/create-info.dto';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateMarriageDto {
  @IsOptional()
  @IsString()
  relation?: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateInfoDto)
  extra_info: CreateInfoDto;

  @IsNotEmpty()
  person: string;
}
