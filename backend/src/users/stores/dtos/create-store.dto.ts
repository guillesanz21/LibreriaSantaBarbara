import { Transform } from 'class-transformer';
import {
  Contains,
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { IsUnique } from 'src/utils/validators/isUnique.validator';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { store: constraints } = userConstraints;

export class CreateStoreDto extends CreateUserDto {
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(userConstraints.common.email.maxLength)
  @IsUnique('Store')
  email: string;

  @IsNotEmpty()
  @IsString()
  @Contains(userConstraints.common.password.contains) // To ensure that the password is hashed
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(constraints.name.maxLength)
  @IsUnique('Store')
  name: string;

  @IsOptional()
  @IsAlphanumeric()
  @MaxLength(constraints.NIF.maxLength)
  @IsUnique('Store')
  NIF?: string;
}
