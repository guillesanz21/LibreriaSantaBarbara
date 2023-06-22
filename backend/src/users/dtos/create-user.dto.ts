import {
  IsDefined,
  IsOptional,
  IsBoolean,
  IsString,
  // IsNumber,
  IsDate,
  IsEmail,
  MaxLength,
} from 'class-validator';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { common: constraints } = userConstraints;

export class CreateUserDto {
  // ? Should I leave this here?
  // @IsDefined()
  // @IsNumber()
  // id: number;

  @IsDefined()
  @IsBoolean()
  is_admin: boolean;

  @IsDefined()
  @IsEmail()
  @MaxLength(constraints.email.maxLength)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(constraints.address.maxLength)
  address: string;

  @IsDefined()
  @IsString()
  @MaxLength(constraints.phone_number.maxLength)
  phone_number: string;

  @IsDefined()
  @IsDate()
  created_at: Date;

  @IsDefined()
  @IsDate()
  updated_at: Date;
}
