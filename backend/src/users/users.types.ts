import { Customer } from './customers/entities/customer.entity';
import { Store } from './stores/entities/store.entity';

export type UserType = 'store' | 'customer';

export type RoleType =
  | 'admin'
  | 'customer'
  | 'store'
  | 'unapprovedStore'
  | 'unconfirmedCustomer'
  | 'guest';

export type User = Store | Customer;
