import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AproveRejectStroreDto {
  @ApiProperty({
    example: '1a2b3c4d5e6f',
    description: 'The hash used to aprove or reject the store by the admin',
  })
  @IsNotEmpty()
  hash: string;
}
