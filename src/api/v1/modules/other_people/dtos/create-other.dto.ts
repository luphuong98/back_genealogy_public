import { CreateInfoDto } from '@modules/person/dtos/create-info.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateOtherDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    default: 'Con',
  })
  relation?: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @ApiProperty({
    type: CreateInfoDto,
  })
  @Type(() => CreateInfoDto)
  extra_info: CreateInfoDto;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    default: '64c0014361b05daf1e3b6100',
    required: true,
  })
  person: string;
}
