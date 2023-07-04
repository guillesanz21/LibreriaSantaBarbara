import { Customer } from './customers/entities/customer.entity';
import { Store } from './stores/entities/store.entity';
import { User } from './entities/user.entity';

export type GeneralUser = Store | Customer | User;
