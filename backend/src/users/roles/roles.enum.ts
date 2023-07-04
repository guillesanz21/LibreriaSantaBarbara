export enum RolesEnum {
  admin = 1,
  store = 2,
  customer = 3,
  unapprovedStore = 4,
  unconfirmedCustomer = 5,
  guest = 6,
}

export type RoleType =
  | 'admin'
  | 'customer'
  | 'store'
  | 'unapprovedStore'
  | 'unconfirmedCustomer'
  | 'guest';
