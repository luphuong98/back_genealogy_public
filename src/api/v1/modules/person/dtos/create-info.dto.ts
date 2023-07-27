import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    type: String,
    default: 'Le',
  })
  first_name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  @ApiProperty({
    type: String,
    default: 'Hoang',
  })
  last_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  @ApiProperty({
    type: String,
    default: '張 登 長',
  })
  chinese_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  @ApiProperty({
    type: String,
    default: 'Câu kê . Thiền Đức bá',
  })
  note_name?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    type: String,
    default: '1970',
  })
  birthday?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    type: String,
    default: '2023',
  })
  dead_day?: string;

  @IsOptional()
  @IsEnum(GENDER)
  @ApiProperty({
    type: String,
    enum: Object.values(GENDER),
    default: GENDER.OTHER,
  })
  gender?: GENDER;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    default: 'sinh tại Mỹ Khê',
  })
  birth_place?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    default: 'mộ táng tại Mỹ Khê',
  })
  burial_place?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    default: 'Thôn Minh Quang xã Tịnh Hòa, Sơn Tịnh, Quảng Ngãi.',
  })
  address?: string;

  @IsOptional()
  @ApiProperty({
    type: [String],
    default:
      'Trương Thị Thùy Trang là con ông Trương Quang Lề và bà Nguyễn Thị Lý, sanh năm 1972 tại thôn Cổ Lũy xã Tịnh Khê.',
  })
  note?: string[];
}
