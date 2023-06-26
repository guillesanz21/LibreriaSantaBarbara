import { Transform } from 'class-transformer';
import {
  // Contains,
  IsAlphanumeric,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { IsUnique } from 'src/utils/validators/isUnique.validator';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { common: commonConstraints } = userConstraints;
const { customer: customerConstraints } = userConstraints;

export class CreateCustomerDto {
  @IsOptional()
  @IsBoolean()
  is_admin?: boolean;

  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(commonConstraints.email.maxLength)
  @IsUnique('Customer')
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(commonConstraints.password.minLength)
  // @Contains(commonConstraints.password.contains) // To ensure that the password is hashed
  password?: string;

  @IsOptional()
  @IsString()
  @MaxLength(customerConstraints.first_name.maxLength)
  first_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(customerConstraints.last_name.maxLength)
  last_name?: string;

  @IsOptional()
  @IsAlphanumeric()
  @MaxLength(customerConstraints.DNI.maxLength)
  @IsUnique('Customer')
  DNI?: string;

  @IsOptional()
  @IsString()
  @MaxLength(commonConstraints.address.maxLength)
  address?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(commonConstraints.phone_number.maxLength)
  phone_number: string;

  @IsOptional()
  @IsBoolean()
  email_confirmed?: boolean;
}
