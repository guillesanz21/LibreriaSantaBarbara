import { RoleType, User } from 'src/users/users.types';

// Add new auth providers here
export enum AuthProvidersEnum {
  email = 'email',
  // facebook = 'facebook',
  // google = 'google',
  // twitter = 'twitter',
  // apple = 'apple',
}

export interface SocialInterface {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export type JWTPayload = {
  id: number;
  userType: 'store' | 'customer';
  role: RoleType;
  provider?: AuthProvidersEnum | undefined; // Only for customers
};

export type JWTPayloadType = JWTPayload & {
  iat: number;
  exp: number;
};

export type LoginResponseType = Readonly<{
  token: string | null;
  user: User | null;
}>;
