import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { GENDER } from 'src/api/v1/common/shared/enum/gender.enum';

export class CreateInfoDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  first_name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  last_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  chinese_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  note_name?: string;

  @IsOptional()
  @IsDateString()
  birthday?: Date;

  @IsOptional()
  @IsDateString()
  dead_day?: Date;

  @IsOptional()
  @IsEnum(GENDER)
  gender?: GENDER;

  @IsOptional()
  @IsString()
  birth_place?: string;

  @IsOptional()
  @IsString()
  burial_place?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  note?: string[];
}
