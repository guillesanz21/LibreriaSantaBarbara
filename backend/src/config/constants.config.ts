import { registerAs } from '@nestjs/config';
import { getValue } from './utils';

type constantsConfigType = {
  pepper: string;
  salt_rounds: number;
};

export default registerAs('constants', () => {
  const constantsConfig: constantsConfigType = {
    pepper: getValue('PEPPER'),
    salt_rounds: parseInt(getValue('SALT_ROUNDS')),
  };

  return constantsConfig;
});
