import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateInfoDto } from './create-info.dto';

export class CreatePersonDto {
  @IsNotEmpty()
  @MaxLength(50)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateInfoDto)
  extra_info: CreateInfoDto;

  // @IsOptional()
  // @IsArray()
  // @Type(() => CreatePersonDto)
  // ancestors?: CreatePersonDto[];

  // @IsOptional()
  // @Type(() => CreatePersonDto)
  // parent?: CreatePersonDto;
}
