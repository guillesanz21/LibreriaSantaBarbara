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
} from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { IsCompositeUnique } from 'src/utils/validators/isCompositeUnique.validator';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthProvidersEnum } from 'src/auth/auth.types';
import { UserTypesEnum } from 'src/users/user-types/user_types.enum';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { common: commonConstraints } = userConstraints;
const { customer: customerConstraints } = userConstraints;

export class CreateCustomerDto extends CreateUserDto {
  @IsNotEmpty()
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @MaxLength(commonConstraints.email.maxLength)
  @IsCompositeUnique('User', 'user_type_id', UserTypesEnum.customer)
  email: string;

  @IsOptional()
  @IsAlphanumeric()
  @MaxLength(commonConstraints.NIF.maxLength)
  @IsCompositeUnique('User', 'user_type_id', UserTypesEnum.customer)
  NIF?: string;

  @IsOptional()
  @IsBoolean()
  email_confirmed?: boolean;

  @IsOptional()
  @IsString()
  @IsEnum(AuthProvidersEnum)
  provider?: string;

  @IsOptional()
  @IsString()
  @IsCompositeUnique('Customer', 'provider')
  social_id?: string;

  @IsOptional()
  @MaxLength(customerConstraints.first_name.maxLength)
  first_name?: string;

  @IsOptional()
  @MaxLength(customerConstraints.last_name.maxLength)
  last_name?: string;
}
