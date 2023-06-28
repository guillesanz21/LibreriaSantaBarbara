import { IsNotEmpty, MinLength } from 'class-validator';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { common: commonConstraints } = userConstraints;

export class AuthUpdatePasswordDto {
  @IsNotEmpty()
  @MinLength(commonConstraints.password.minLength)
  password?: string;

  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  oldPassword: string;
}
