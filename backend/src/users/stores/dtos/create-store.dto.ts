import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { IsCompositeUnique } from 'src/utils/validators/isCompositeUnique.validator';
import { IsUnique } from 'src/utils/validators/isUnique.validator';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UserTypesEnum } from 'src/users/user-types/user_types.enum';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { store: storeConstraints } = userConstraints;
const { common: commonConstraints } = userConstraints;

export class CreateStoreDto extends CreateUserDto {
  @IsNotEmpty()
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @MaxLength(commonConstraints.email.maxLength)
  @IsCompositeUnique('User', 'user_type_id', UserTypesEnum.store)
  email: string;

  @IsOptional()
  @IsAlphanumeric()
  @MaxLength(commonConstraints.NIF.maxLength)
  @IsCompositeUnique('User', 'user_type_id', UserTypesEnum.store)
  NIF?: string;

  @IsNotEmpty()
  @MinLength(commonConstraints.password.minLength)
  password: string;

  @IsNotEmpty()
  @MaxLength(storeConstraints.name.maxLength)
  @IsUnique('Store')
  name: string;

  @IsOptional()
  @IsBoolean()
  approved?: boolean;
}
