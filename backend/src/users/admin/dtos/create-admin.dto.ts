import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { IsExists } from 'src/utils/validators/isExists.validator';
import { IsCompositeUnique } from 'src/utils/validators/isCompositeUnique.validator';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UserTypesEnum } from 'src/users/user-types/user_types.enum';
import { RolesEnum } from 'src/users/roles/roles.enum';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { common: commonConstraints } = userConstraints;

export class CreateAdminDto extends CreateUserDto {
  @ApiProperty({
    example: 1,
    default: 1,
    description: 'The role ID.',
    enum: RolesEnum,
  })
  @IsDefined()
  @IsExists('Role', 'id')
  role_id: number;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'The user type ID.',
    enum: UserTypesEnum,
  })
  @IsDefined()
  @IsExists('User_Type', 'id')
  user_type_id?: number;

  @ApiProperty({
    example: 'admin@admin.com',
    required: true,
    description: 'The email of the admin. Should be unique.',
    maxLength: commonConstraints.email.maxLength,
  })
  @IsNotEmpty()
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @MaxLength(commonConstraints.email.maxLength)
  @IsCompositeUnique('User', 'user_type_id', UserTypesEnum.admin)
  email: string;

  @ApiProperty({
    example: 'test',
    required: true,
    description: 'The password of the store.',
    minLength: commonConstraints.password.minLength,
  })
  @IsNotEmpty()
  @MinLength(commonConstraints.password.minLength)
  password: string;

  @ApiPropertyOptional({
    example: null,
    default: null,
    description:
      'The NIF of the store. Should be alphanumeric and unique among stores.',
    maxLength: commonConstraints.NIF.maxLength,
  })
  @IsOptional()
  @IsAlphanumeric()
  @MaxLength(commonConstraints.NIF.maxLength)
  @IsCompositeUnique('User', 'user_type_id', UserTypesEnum.admin)
  NIF?: string;
}
