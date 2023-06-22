import {
  IsAlphanumeric,
  IsDate,
  IsDefined,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { store: constraints } = userConstraints;

export class CreateStoreDto extends CreateUserDto {
  @IsDefined()
  @IsString()
  // Note: This is checking the length of the original password, not the hashed one that will be stored in the database
  @MinLength(constraints.password.minLength)
  password: string;

  @IsDefined()
  @IsString()
  @MaxLength(constraints.name.maxLength)
  name: string;

  @IsOptional()
  @IsAlphanumeric()
  @MaxLength(constraints.NIF.maxLength)
  NIF: string;

  @IsDefined()
  @IsDate()
  last_activity: Date;
}
