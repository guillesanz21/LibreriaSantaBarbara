import { Transform } from 'class-transformer';
import {
  Contains,
  IsAlphanumeric,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { IsUnique } from 'src/utils/validators/isUnique.validator';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { customer: constraints } = userConstraints;

export class CreateCustomerDto extends CreateUserDto {
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(userConstraints.common.email.maxLength)
  @IsUnique('Customer')
  email: string;

  @IsOptional()
  @IsString()
  @Contains(userConstraints.common.password.contains) // To ensure that the password is hashed
  password?: string;

  @IsOptional()
  @IsString()
  @MaxLength(constraints.first_name.maxLength)
  first_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(constraints.last_name.maxLength)
  last_name?: string;

  @IsOptional()
  @IsAlphanumeric()
  @MaxLength(constraints.DNI.maxLength)
  @IsUnique('Customer')
  DNI?: string;

  @IsOptional()
  @IsBoolean()
  email_confirmed?: boolean;
}
