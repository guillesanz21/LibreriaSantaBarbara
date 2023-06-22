import { Module } from '@nestjs/common';
import { IsISO6391Constraint } from 'src/utils/validators/isISO6391.validator';

@Module({
  providers: [IsISO6391Constraint],
})
export class LanguagesModule {}
