export enum RolesEnum {
  admin = 1,
  store = 2,
  customer = 3,
  unapprovedStore = 4,
  unconfirmed = 5,
  guest = 6,
}

export type RoleType =
  | 'admin'
  | 'customer'
  | 'store'
  | 'unapprovedStore'
  | 'unconfirmed'
  | 'guest';
