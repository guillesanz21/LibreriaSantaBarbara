import { IsNotEmpty } from 'class-validator';
import { IsExists } from 'src/utils/validators/isExists.validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class AuthEmailCustomerLoginDto {
  @Transform(lowerCaseTransformer)
  @IsExists('Customer')
  email: string;

  @IsNotEmpty()
  password: string;
}
