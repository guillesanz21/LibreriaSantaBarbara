import { IsNotEmpty } from 'class-validator';
import { IsExists } from 'src/utils/validators/isExists.validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class AuthLoginEmailDto {
  @Transform(lowerCaseTransformer)
  // TODO: IsCompositeExists validator (check if email and user_type exists)
  @IsExists('User')
  email: string;

  @IsNotEmpty()
  password: string;
}
