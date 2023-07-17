import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { common: commonConstraints } = userConstraints;

export class AuthUpdatePasswordDto {
  @ApiProperty({
    example: 'test',
    description: 'The new password of the user.',
    minLength: commonConstraints.password.minLength,
  })
  @IsNotEmpty()
  @MinLength(commonConstraints.password.minLength)
  password: string;

  @ApiProperty({
    example: 'oldPassword1234#',
    description: 'The old password of the user.',
  })
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  oldPassword: string;
}
