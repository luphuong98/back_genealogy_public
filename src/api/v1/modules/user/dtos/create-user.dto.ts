import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { GENDER } from 'src/api/v1/common/shared/enum/gender.enum';
import { USER_ROLE } from 'src/api/v1/common/shared/enum/user-role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({
    type: String,
    default: 'Le',
    required: true,
  })
  first_name: string;

  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({
    type: String,
    default: 'Hoang',
    required: true,
  })
  last_name: string;

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
  @MaxLength(50)
  @ApiProperty({
    type: String,
    default: 'john111',
    uniqueItems: true,
  })
  username: string;

  @IsOptional()
  @ApiProperty({
    type: String,
    default: '0320071134',
    required: true,
  })
  phone_number?: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @ApiProperty({
    type: String,
    default: 'le@example.com',
    required: true,
  })
  password: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    type: String,
    default: '1970',
  })
  birthday?: string;

  @IsOptional()
  @IsEnum(GENDER)
  @ApiProperty({
    type: String,
    enum: Object.values(GENDER),
    default: GENDER.OTHER,
  })
  gender?: GENDER;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    type: [String],
    default: 'Tp.HCM',
  })
  address?: string[];

  @IsOptional()
  @IsEnum(USER_ROLE)
  @ApiProperty({
    type: String,
    enum: Object.values(USER_ROLE),
    default: USER_ROLE.USER,
  })
  role?: USER_ROLE;
}
