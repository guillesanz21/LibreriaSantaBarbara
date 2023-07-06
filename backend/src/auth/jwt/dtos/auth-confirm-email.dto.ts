import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthConfirmEmailDto {
  @ApiProperty({
    example: '1a2b3c4d5e6f',
    description:
      'The hash used to verify the email of the user at registration',
  })
  @IsNotEmpty()
  hash: string;
}
