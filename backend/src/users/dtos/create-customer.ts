import {
  IsAlphanumeric,
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { CreateUserDto } from './create-user.dto';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { customer: constraints } = userConstraints;

export class CreateCustomerDto extends CreateUserDto {
  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(constraints.first_name.maxLength)
  first_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(constraints.last_name.maxLength)
  last_name: string;

  @IsOptional()
  @IsAlphanumeric()
  @MaxLength(constraints.DNI.maxLength)
  DNI: string;

  @IsDefined()
  @IsBoolean()
  email_confirmed: boolean;
}
