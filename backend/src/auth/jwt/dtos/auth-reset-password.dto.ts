import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';
import { userConstraints } from 'src/config/constants/database.constraint_values';

const { common: commonConstraints } = userConstraints;

export class AuthResetPasswordDto {
  @ApiProperty({
    example: 'powerfulPassword1234#',
    description: 'The new password of the user.',
    minLength: commonConstraints.password.minLength,
  })
  @IsNotEmpty()
  @MinLength(commonConstraints.password.minLength)
  password: string;

  @ApiProperty({
    example: '1a2b3c4d5e6f',
    description: 'The hash used to reset the password of the user.',
  })
  @IsNotEmpty()
  hash: string;
}
