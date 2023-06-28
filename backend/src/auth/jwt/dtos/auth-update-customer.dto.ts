import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { userConstraints } from 'src/config/constants/database.constraint_values';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { IsUnique } from 'src/utils/validators/isUnique.validator';

const { common: commonConstraints } = userConstraints;
const { customer: customerConstraints } = userConstraints;

export class AuthUpdateCustomerDto {
  @IsOptional()
  @Transform(lowerCaseTransformer)
  @IsUnique('Customer')
  @IsEmail()
  email?: string;

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

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(commonConstraints.phone_number.maxLength)
  phone_number?: string;
}
