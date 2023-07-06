import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { IsExists } from 'src/utils/validators/isExists.validator';

export class AuthForgotPasswordDto {
  @ApiProperty({
    example: 'example@example.com',
    description:
      'The email of the user that forgot the password. Should exist.',
  })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @IsExists('User')
  email: string;
}
