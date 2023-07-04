import { registerAs } from '@nestjs/config';
import { getValue } from './utils';

type appConfigType = {
  env: string;
  apiPrefix: string;
  name: string;
  port: number;
  host: string;
};

export default registerAs('app', () => {
  const appConfig: appConfigType = {
    env: getValue('NODE_ENV'),
    apiPrefix: getValue('API_PREFIX'),
    name: getValue('APP_NAME'),
    port: parseInt(getValue('APP_PORT'), 10),
    host: getValue('APP_HOST'),
  };

  return appConfig;
});
