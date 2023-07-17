import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { IsCompositeUnique } from 'src/utils/validators/isCompositeUnique.validator';
import { IsUnique } from 'src/utils/validators/isUnique.validator';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { common: commonConstraints } = userConstraints;
const { store: storeConstraints } = userConstraints;

export class AuthUpdateStoreDto {
  @ApiPropertyOptional({
    example: 'store@store.com',
    description: 'The email of the store. Should be unique among stores.',
    maxLength: commonConstraints.email.maxLength,
  })
  @IsOptional()
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @MaxLength(commonConstraints.email.maxLength)
  @IsCompositeUnique('User', 'user_type')
  email?: string;

  @ApiPropertyOptional({
    example: '12345678A',
    description:
      'The NIF of the store. Should be alphanumeric and unique among stores.',
    maxLength: commonConstraints.NIF.maxLength,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsAlphanumeric()
  @MaxLength(commonConstraints.NIF.maxLength)
  @IsUnique('Store')
  NIF?: string;

  @ApiPropertyOptional({
    example: '+34661122334',
    description: 'The phone number of the store.',
    maxLength: commonConstraints.phone_number.maxLength,
  })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(commonConstraints.phone_number.maxLength)
  phone_number?: string;

  @ApiPropertyOptional({
    example: 'Librería San Pablo',
    description: 'The name of the store.',
    maxLength: storeConstraints.name.maxLength,
  })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(storeConstraints.name.maxLength)
  @IsUnique('Store')
  name?: string;

  @ApiPropertyOptional({
    example: 'Calle Princesa 12B',
    description: 'The address of the store.',
    maxLength: commonConstraints.address.maxLength,
  })
  @IsOptional()
  @IsString()
  @MaxLength(commonConstraints.address.maxLength)
  address?: string;
}
