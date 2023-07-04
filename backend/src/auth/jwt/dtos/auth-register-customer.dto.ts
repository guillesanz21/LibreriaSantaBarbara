import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { IsCompositeUnique } from 'src/utils/validators/isCompositeUnique.validator';
import { UserTypesEnum } from 'src/users/user-types/user_types.enum';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { common: commonConstraints } = userConstraints;
const { customer: customerConstraints } = userConstraints;

export class AuthRegisterCustomerDto {
  @IsNotEmpty()
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @MaxLength(commonConstraints.email.maxLength)
  @IsCompositeUnique('User', 'user_type_id', UserTypesEnum.customer)
  email: string;

  @IsNotEmpty()
  @MinLength(commonConstraints.password.minLength)
  password: string;

  @IsOptional()
  @IsAlphanumeric()
  @MaxLength(commonConstraints.NIF.maxLength)
  @IsCompositeUnique('User', 'user_type_id', UserTypesEnum.customer)
  NIF?: string;

  @IsOptional()
  @MaxLength(commonConstraints.phone_number.maxLength)
  phone_number?: string;

  @IsOptional()
  @MaxLength(customerConstraints.first_name.maxLength)
  first_name?: string;

  @IsOptional()
  @MaxLength(customerConstraints.last_name.maxLength)
  last_name?: string;

  @IsOptional()
  @MaxLength(commonConstraints.address.maxLength)
  address?: string;
}
