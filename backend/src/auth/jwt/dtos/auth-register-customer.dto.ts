import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { IsCompositeUnique } from 'src/utils/validators/isCompositeUnique.validator';
import { UserTypesEnum } from 'src/users/user-types/user_types.enum';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { common: commonConstraints } = userConstraints;
const { customer: customerConstraints } = userConstraints;

export class AuthRegisterCustomerDto {
  @ApiProperty({
    example: 'customer@customer.com',
    description: 'The email of the customer. Should be unique among customers.',
    maxLength: commonConstraints.email.maxLength,
  })
  @IsNotEmpty()
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @MaxLength(commonConstraints.email.maxLength)
  @IsCompositeUnique('User', 'user_type_id', UserTypesEnum.customer)
  email: string;

  @ApiProperty({
    example: 'test',
    description: 'The password of the customer.',
    minLength: commonConstraints.password.minLength,
  })
  @IsNotEmpty()
  @MinLength(commonConstraints.password.minLength)
  password: string;

  @ApiPropertyOptional({
    example: '12345678A',
    description:
      'The NIF of the customer. Should be alphanumeric and unique among customers.',
    maxLength: commonConstraints.NIF.maxLength,
  })
  @IsOptional()
  @IsAlphanumeric()
  @MaxLength(commonConstraints.NIF.maxLength)
  @IsCompositeUnique('User', 'user_type_id', UserTypesEnum.customer)
  NIF?: string;

  @ApiPropertyOptional({
    example: '+34661122334',
    description: 'The phone number of the customer.',
    maxLength: commonConstraints.phone_number.maxLength,
  })
  @IsOptional()
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
    description: 'The last name(s) of the customer.',
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
