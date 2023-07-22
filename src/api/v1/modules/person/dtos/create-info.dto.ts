import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPostalCode,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { GENDER } from 'src/api/v1/common/shared/enum/gender.enum';

export class CreateInfoDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  first_name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  last_name: string;

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
  note?: Text;
}
