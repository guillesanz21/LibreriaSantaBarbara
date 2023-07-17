import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsUnique } from 'src/utils/validators/isUnique.validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { IsCompositeUnique } from 'src/utils/validators/isCompositeUnique.validator';
import { UserTypesEnum } from 'src/users/user-types/user_types.enum';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { common: commonConstraints } = userConstraints;
const { store: storeConstraints } = userConstraints;

export class AuthRegisterStoreDto {
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

  @ApiProperty({
    example: 'test',
    description: 'The password of the store.',
    minLength: commonConstraints.password.minLength,
  })
  @IsNotEmpty()
  @MinLength(commonConstraints.password.minLength)
  password: string;

  @ApiProperty({
    example: '+34661122334',
    description: 'The phone number of the store.',
    maxLength: commonConstraints.phone_number.maxLength,
  })
  @IsNotEmpty()
  @MaxLength(commonConstraints.phone_number.maxLength)
  phone_number: string;

  @ApiProperty({
    example: '12345678A',
    description:
      'The NIF of the store. Should be alphanumeric and unique among stores.',
    maxLength: commonConstraints.NIF.maxLength,
  })
  @IsNotEmpty()
  @IsAlphanumeric()
  @MaxLength(commonConstraints.NIF.maxLength)
  @IsCompositeUnique('User', 'user_type_id', UserTypesEnum.store)
  NIF: string;

  @ApiProperty({
    example: 'Store Name',
    description: 'The name of the store. Should be unique among stores.',
    maxLength: storeConstraints.name.maxLength,
  })
  @IsNotEmpty()
  @MaxLength(storeConstraints.name.maxLength)
  @IsUnique('Store')
  name: string;

  @ApiPropertyOptional({
    example: 'Calle de la tienda, 123',
    description: 'The address of the store.',
    maxLength: commonConstraints.address.maxLength,
  })
  @IsOptional()
  @MaxLength(commonConstraints.address.maxLength)
  address?: string;
}
