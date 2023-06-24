import {
  IsOptional,
  IsBoolean,
  IsString,
  IsEmail,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { common: constraints } = userConstraints;

export class CreateUserDto {
  @IsOptional()
  @IsBoolean()
  is_admin: boolean;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(constraints.email.maxLength)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(constraints.address.maxLength)
  address: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(constraints.phone_number.maxLength)
  phone_number: string;
}
