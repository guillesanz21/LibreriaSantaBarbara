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
const { store: storeConstraints } = userConstraints;

export class AuthRegisterStoreDto {
  @Transform(lowerCaseTransformer)
  @IsUnique('Store')
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(commonConstraints.password.minLength)
  password: string;

  @IsNotEmpty()
  @MaxLength(commonConstraints.phone_number.maxLength)
  phone_number: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @MaxLength(storeConstraints.NIF.maxLength)
  @IsUnique('Store')
  NIF: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(storeConstraints.name.maxLength)
  @IsUnique('Store')
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(commonConstraints.address.maxLength)
  address?: string;
}
