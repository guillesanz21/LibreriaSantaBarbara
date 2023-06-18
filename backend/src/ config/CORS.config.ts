import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { registerAs } from '@nestjs/config';
import { getValue } from './utils';

export default registerAs('CORS', () => {
  const CORS: CorsOptions = {
    origin: getValue('CORS_ORIGIN') === 'true' ? true : getValue('CORS_ORIGIN'),
    methods: getValue('CORS_METHODS'),
    credentials: getValue('CORS_CREDENTIALS') === 'true',
  };

  return CORS;
});
