import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'store@store.com',
    description: 'The email of the store. Should be unique among stores.',
    maxLength: commonConstraints.email.maxLength,
  })
  @IsNotEmpty()
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @MaxLength(commonConstraints.email.maxLength)
  @IsCompositeUnique('User', 'user_type_id', UserTypesEnum.store)
  email: string;

  @ApiPropertyOptional({
    example: '12345678A',
    description:
      'The NIF of the store. Should be alphanumeric and unique among stores.',
    maxLength: commonConstraints.NIF.maxLength,
  })
  @IsOptional()
  @IsAlphanumeric()
  @MaxLength(commonConstraints.NIF.maxLength)
  @IsCompositeUnique('User', 'user_type_id', UserTypesEnum.store)
  NIF?: string;

  @ApiProperty({
    example: 'test',
    required: true,
    description: 'The password of the store.',
    minLength: commonConstraints.password.minLength,
  })
  @IsNotEmpty()
  @MinLength(commonConstraints.password.minLength)
  password: string;

  @ApiProperty({
    example: 'Librería San Pablo',
    description: 'The name of the store. Should be unique among stores.',
    maxLength: storeConstraints.name.maxLength,
  })
  @IsNotEmpty()
  @MaxLength(storeConstraints.name.maxLength)
  @IsUnique('Store')
  name: string;

  @ApiPropertyOptional({
    example: false,
    default: false,
    description: 'Whether the store has been approved by an admin or not.',
  })
  @IsOptional()
  @IsBoolean()
  approved?: boolean;
}
