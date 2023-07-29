import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
export class RegisterDto {
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
  @IsStrongPassword()
  @ApiProperty({
    type: String,
    default: 'le@example.com',
    required: true,
  })
  password: string;
}
