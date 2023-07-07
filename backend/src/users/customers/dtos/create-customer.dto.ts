import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { IsCompositeUnique } from 'src/utils/validators/isCompositeUnique.validator';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthProvidersEnum } from 'src/auth/auth.types';
import { UserTypesEnum } from 'src/users/user-types/user_types.enum';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { common: commonConstraints } = userConstraints;
const { customer: customerConstraints } = userConstraints;

export class CreateCustomerDto extends CreateUserDto {
  @ApiProperty({
    example: 'example@example.com',
    description: 'The email of the customer. Should be unique among customers.',
    maxLength: commonConstraints.email.maxLength,
  })
  @IsNotEmpty()
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @MaxLength(commonConstraints.email.maxLength)
  @IsCompositeUnique('User', 'user_type_id', UserTypesEnum.customer)
  email: string;

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
    example: AuthProvidersEnum.email,
    default: AuthProvidersEnum.email,
    description: 'The provider of the customer.',
    enum: AuthProvidersEnum,
  })
  @IsOptional()
  @IsString()
  @IsEnum(AuthProvidersEnum)
  provider?: string;

  @ApiPropertyOptional({
    example: null,
    default: null,
    description: 'The social id of the customer associated with the provider.',
  })
  @IsOptional()
  @IsString()
  @IsCompositeUnique('Customer', 'provider')
  social_id?: string;

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
}
