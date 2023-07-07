import { Injectable } from '@nestjs/common';
import { Store } from '../stores/entities/store.entity';
import { UsersService } from '../users.service';
import { StoresService } from '../stores/stores.service';
import { AproveRejectStroreDto } from './dtos/aprove-reject-store.dto';
import { UserTypesEnum } from '../user-types/user_types.enum';
import { RolesEnum } from '../roles/roles.enum';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly storesService: StoresService,
  ) {}

  private async retrieveStore({
    hash,
  }: AproveRejectStroreDto): Promise<Store | string> {
    const user = await this.usersService.findOne({ hash });
    if (!user) {
      return 'UserNotFound';
    }
    if (user.hash !== hash) {
      return 'HashNotValid';
    }
    if (user.user_type_id !== UserTypesEnum.store) {
      return 'UserNotStore';
    }
    if (!user.email_confirmed || user.role_id === RolesEnum.unconfirmed) {
      return 'EmailNotConfirmed';
    }
    const store = await this.storesService.findOne({ user_id: user.id });
    if (!store) {
      return 'StoreNotFound';
    }
    if (store.approved || user.role_id !== RolesEnum.unapprovedStore) {
      return 'StoreAlreadyApproved';
    }
    return store;
  }

  async aproveStore({ hash }: AproveRejectStroreDto): Promise<string> {
    const store = await this.retrieveStore({ hash });
    if (typeof store === 'string') {
      return store;
    }
    store.approved = true;
    store.user.role_id = RolesEnum.store;
    store.user.hash = null;
    await this.storesService.update(store.id, store);

    return '';
  }

  async rejectStore({ hash }: AproveRejectStroreDto): Promise<string> {
    const store = await this.retrieveStore({ hash });
    if (typeof store === 'string') {
      return store;
    }
    await this.storesService.softDelete(store.id);

    return '';
  }
}
