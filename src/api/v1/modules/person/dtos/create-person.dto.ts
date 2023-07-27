import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateInfoDto } from './create-info.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePersonDto {
  @IsNotEmpty()
  @MaxLength(50)
  @IsEmail()
  @ApiProperty({
    type: String,
    default: 'dcd2023@gmail.com',
    uniqueItems: true,
    required: true,
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    default: '0320071134',
    required: true,
  })
  phone_number: string;

  @IsNotEmpty()
  @ApiProperty({
    type: CreateInfoDto,
    required: true,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateInfoDto)
  extra_info: CreateInfoDto;
}
