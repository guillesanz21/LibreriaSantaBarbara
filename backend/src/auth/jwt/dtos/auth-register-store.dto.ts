import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsUnique } from 'src/utils/validators/isUnique.validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { IsCompositeUnique } from 'src/utils/validators/isCompositeUnique.validator';
import { UserTypesEnum } from 'src/users/user-types/user_types.enum';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { common: commonConstraints } = userConstraints;
const { store: storeConstraints } = userConstraints;

export class AuthRegisterStoreDto {
  @IsNotEmpty()
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @MaxLength(commonConstraints.email.maxLength)
  @IsCompositeUnique('User', 'user_type_id', UserTypesEnum.store)
  email: string;

  @IsNotEmpty()
  @MinLength(commonConstraints.password.minLength)
  password: string;

  @IsNotEmpty()
  @MaxLength(commonConstraints.phone_number.maxLength)
  phone_number: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @MaxLength(commonConstraints.NIF.maxLength)
  @IsCompositeUnique('User', 'user_type_id', UserTypesEnum.store)
  NIF: string;

  @IsNotEmpty()
  @MaxLength(storeConstraints.name.maxLength)
  @IsUnique('Store')
  name: string;

  @IsOptional()
  @MaxLength(commonConstraints.address.maxLength)
  address?: string;
}
