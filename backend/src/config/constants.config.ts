import { registerAs } from '@nestjs/config';
import { getValue } from './utils';

type constantsConfigType = {
  pepper: string;
};

export default registerAs('constants', () => {
  const constantsConfig: constantsConfigType = {
    pepper: getValue('PEPPER'),
  };

  return constantsConfig;
});
