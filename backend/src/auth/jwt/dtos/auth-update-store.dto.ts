import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { IsCompositeUnique } from 'src/utils/validators/isCompositeUnique.validator';
import { IsUnique } from 'src/utils/validators/isUnique.validator';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { common: commonConstraints } = userConstraints;
const { store: storeConstraints } = userConstraints;

export class AuthUpdateStoreDto {
  @IsOptional()
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @MaxLength(commonConstraints.email.maxLength)
  @IsCompositeUnique('User', 'user_type')
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsAlphanumeric()
  @MaxLength(commonConstraints.NIF.maxLength)
  @IsUnique('Store')
  NIF?: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(commonConstraints.phone_number.maxLength)
  phone_number?: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(storeConstraints.name.maxLength)
  @IsUnique('Store')
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(commonConstraints.address.maxLength)
  address?: string;
}
