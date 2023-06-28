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
const { store: storeConstraints } = userConstraints;

export class AuthUpdateStoreDto {
  @IsOptional()
  @Transform(lowerCaseTransformer)
  @IsUnique('Store')
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(storeConstraints.name.maxLength)
  @IsUnique('Store')
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(commonConstraints.phone_number.maxLength)
  phone_number?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsAlphanumeric()
  @MaxLength(storeConstraints.NIF.maxLength)
  @IsUnique('Store')
  NIF?: string;

  @IsOptional()
  @IsString()
  @MaxLength(commonConstraints.address.maxLength)
  address?: string;
}
