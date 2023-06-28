import { registerAs } from '@nestjs/config';
import { getValue } from './utils';

type authConfigType = {
  pepper: string;
  salt_rounds: number;
  jwt_secret: string;
  jwt_expires: string;
};

export default registerAs('auth', () => {
  const authConfig: authConfigType = {
    pepper: getValue('PEPPER'),
    salt_rounds: parseInt(getValue('SALT_ROUNDS')),
    jwt_secret: getValue('AUTH_JWT_SECRET'),
    jwt_expires: getValue('AUTH_JWT_TOKEN_EXPIRES_IN'),
  };

  return authConfig;
});
