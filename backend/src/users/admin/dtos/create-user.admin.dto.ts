import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { IsExists } from 'src/utils/validators/isExists.validator';
import { IsCompositeUnique } from 'src/utils/validators/isCompositeUnique.validator';
import { UserTypesEnum } from 'src/users/user-types/user_types.enum';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { common: commonConstraints } = userConstraints;

export class CreateUserAdminDto {
  @IsDefined()
  @IsExists('Role', 'id')
  role_id: number;

  @IsDefined()
  @IsExists('User_Type', 'id')
  user_type_id?: number;

  @IsNotEmpty()
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @MaxLength(commonConstraints.email.maxLength)
  @IsCompositeUnique('User', 'user_type_id', UserTypesEnum.admin)
  email: string;

  @IsOptional()
  @MinLength(commonConstraints.password.minLength)
  password?: string;

  @IsOptional()
  @MaxLength(commonConstraints.address.maxLength)
  address?: string;

  @IsOptional()
  @MaxLength(commonConstraints.phone_number.maxLength)
  phone_number?: string;

  @IsOptional()
  @IsString()
  hash?: string;
}
