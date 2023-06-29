import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsUnique } from 'src/utils/validators/isUnique.validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { common: commonConstraints } = userConstraints;
const { customer: customerConstraints } = userConstraints;

export class AuthRegisterCustomerDto {
  @Transform(lowerCaseTransformer)
  @IsUnique('Customer')
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(commonConstraints.password.minLength)
  password: string;

  @IsOptional()
  @MaxLength(commonConstraints.phone_number.maxLength)
  phone_number: string;

  @IsOptional()
  @IsAlphanumeric()
  @MaxLength(customerConstraints.DNI.maxLength)
  @IsUnique('Customer')
  DNI?: string;

  @IsOptional()
  @IsString()
  @MaxLength(customerConstraints.first_name.maxLength)
  first_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(customerConstraints.last_name.maxLength)
  last_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(commonConstraints.address.maxLength)
  address?: string;
}
