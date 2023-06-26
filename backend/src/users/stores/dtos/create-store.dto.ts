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

const { store: storeConstraints } = userConstraints;
const { common: commonConstraints } = userConstraints;

export class CreateStoreDto {
  @IsOptional()
  @IsBoolean()
  is_admin?: boolean;

  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(commonConstraints.email.maxLength)
  @IsUnique('Store')
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(commonConstraints.password.minLength)
  // @Contains(commonConstraints.password.contains) // To ensure that the password is hashed
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(storeConstraints.name.maxLength)
  @IsUnique('Store')
  name: string;

  @IsOptional()
  @IsAlphanumeric()
  @MaxLength(storeConstraints.NIF.maxLength)
  @IsUnique('Store')
  NIF?: string;

  @IsOptional()
  @IsString()
  @MaxLength(commonConstraints.address.maxLength)
  address?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(commonConstraints.phone_number.maxLength)
  phone_number: string;
}
