import { PartialType } from '@nestjs/mapped-types';
import { CreateUserAdminDto } from './create-user.admin.dto';

export class UpdateUserAdminDto extends PartialType(CreateUserAdminDto) {}
