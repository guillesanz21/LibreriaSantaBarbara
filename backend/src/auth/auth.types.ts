import { GeneralUser } from 'src/users/users.types';
import { RolesEnum } from 'src/users/roles/roles.enum';
import { UserTypesEnum } from 'src/users/user-types/user_types.enum';

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
  userType: UserTypesEnum;
  role: RolesEnum;
  provider?: AuthProvidersEnum | undefined; // Only for customers
};

export type JWTPayloadType = JWTPayload & {
  iat: number;
  exp: number;
};

export type LoginResponseType = Readonly<{
  token: string | null;
  user: GeneralUser | null;
}>;
