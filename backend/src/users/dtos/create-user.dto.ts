import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsExists } from 'src/utils/validators/isExists.validator';
import { RolesEnum } from '../roles/roles.enum';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { common: commonConstraints } = userConstraints;

export class CreateUserDto {
  @ApiProperty({
    example: 2,
    description: 'The id of the role that the user will have',
    enum: RolesEnum,
  })
  @IsDefined()
  @IsExists('Role', 'id')
  role_id: number;

  @ApiPropertyOptional({
    example: 'powerfulPassword1234#',
    description: 'The password of the user',
    minLength: commonConstraints.password.minLength,
  })
  @IsOptional()
  @MinLength(commonConstraints.password.minLength)
  password?: string;

  @ApiPropertyOptional({
    example: 'Calle Princesa 12B',
    description: 'The address of the user',
    maxLength: commonConstraints.address.maxLength,
  })
  @IsOptional()
  @MaxLength(commonConstraints.address.maxLength)
  address?: string;

  @ApiPropertyOptional({
    example: '+34661122334',
    description: 'The phone number of the user',
    maxLength: commonConstraints.phone_number.maxLength,
  })
  @IsOptional()
  @MaxLength(commonConstraints.phone_number.maxLength)
  phone_number?: string;

  @ApiPropertyOptional({
    example: false,
    default: false,
    description:
      'Whether the email of the user has been confirmed or not by the himself.',
  })
  @IsOptional()
  @IsBoolean()
  email_confirmed?: boolean;

  @ApiPropertyOptional({
    example: null,
    default: null,
    description: 'Hash used to verify the email of the user at registration',
  })
  @IsOptional()
  @IsString()
  hash?: string;
}
