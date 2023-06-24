import {
  IsAlphanumeric,
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { store: constraints } = userConstraints;

export class CreateStoreDto extends CreateUserDto {
  @IsNotEmpty()
  @IsString()
  // Note: This is checking the length of the original password, not the hashed one that will be stored in the database
  @MinLength(constraints.password.minLength)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(constraints.name.maxLength)
  name: string;

  @IsOptional()
  @IsAlphanumeric()
  @MaxLength(constraints.NIF.maxLength)
  NIF: string;
}
