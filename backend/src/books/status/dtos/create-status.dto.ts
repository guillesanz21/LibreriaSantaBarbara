import { IsNotEmpty, MaxLength } from 'class-validator';
import { bookConstraints as constraints } from 'src/config/constants/database.constraint_values';

export class CreateStatusDto {
  @IsNotEmpty()
  @MaxLength(constraints.status.maxLength)
  // CHECK: Implement @IsUnique() validator or catch error generated by the database?
  status: string;
}
