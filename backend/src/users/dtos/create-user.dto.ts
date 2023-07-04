import {
  IsDefined,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsExists } from 'src/utils/validators/isExists.validator';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { common: commonConstraints } = userConstraints;

export class CreateUserDto {
  @IsDefined()
  @IsExists('Role', 'id')
  role_id: number;

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
