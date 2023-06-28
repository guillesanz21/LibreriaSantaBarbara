import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { IsUnique } from 'src/utils/validators/isUnique.validator';
import { userConstraints } from 'src/config/constants/database.constraint_values';
import { AuthProvidersEnum } from 'src/auth/auth.types';

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
  password?: string;

  @IsOptional()
  @IsString()
  @IsEnum(AuthProvidersEnum)
  provider?: string;

  @IsOptional()
  @IsString()
  social_id?: string;

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

  @IsOptional()
  @IsString()
  @MaxLength(commonConstraints.phone_number.maxLength)
  phone_number: string;

  @IsOptional()
  @IsBoolean()
  email_confirmed?: boolean;
}
