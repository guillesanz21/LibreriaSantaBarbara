import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsExists } from 'src/utils/validators/isExists.validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class AuthLoginEmailDto {
  @ApiProperty({
    example: 'example@example.com',
    description:
      'The email of the user that forgot the password. Should exist.',
  })
  @Transform(lowerCaseTransformer)
  // TODO: IsCompositeExists validator (check if email and user_type exists)
  @IsExists('User')
  email: string;

  @ApiProperty({
    example: 'powerfulPassword1234#',
    description: 'The password of the user.',
  })
  @IsNotEmpty()
  password: string;
}
