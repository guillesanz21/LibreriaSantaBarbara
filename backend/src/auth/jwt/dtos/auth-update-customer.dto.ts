import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { IsCompositeUnique } from 'src/utils/validators/isCompositeUnique.validator';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { common: commonConstraints } = userConstraints;
const { customer: customerConstraints } = userConstraints;

export class AuthUpdateCustomerDto {
  @ApiPropertyOptional({
    example: 'example@example.com',
    description: 'The email of the customer. Should be unique among customers.',
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
      'The NIF of the customer. Should be alphanumeric and unique among customers.',
    maxLength: commonConstraints.NIF.maxLength,
  })
  @IsOptional()
  @IsAlphanumeric()
  @MaxLength(commonConstraints.NIF.maxLength)
  @IsCompositeUnique('User', 'user_type')
  NIF?: string;

  @ApiPropertyOptional({
    example: '+34661122334',
    description: 'The phone number of the customer.',
    maxLength: commonConstraints.phone_number.maxLength,
  })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(commonConstraints.phone_number.maxLength)
  phone_number?: string;

  @ApiPropertyOptional({
    example: 'John',
    description: 'The first name of the customer.',
    maxLength: customerConstraints.first_name.maxLength,
  })
  @IsOptional()
  @MaxLength(customerConstraints.first_name.maxLength)
  first_name?: string;

  @ApiPropertyOptional({
    example: 'Doe Doe',
    description: 'The last name of the customer.',
    maxLength: customerConstraints.last_name.maxLength,
  })
  @IsOptional()
  @MaxLength(customerConstraints.last_name.maxLength)
  last_name?: string;

  @ApiPropertyOptional({
    example: 'Calle Princesa 12B',
    description: 'The address of the customer.',
    maxLength: commonConstraints.address.maxLength,
  })
  @IsOptional()
  @MaxLength(commonConstraints.address.maxLength)
  address?: string;
}
