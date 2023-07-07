import { registerAs } from '@nestjs/config';
import { getValue } from './utils';

type emailConfigType = {
  port: number;
  host: string;
  user: string;
  password: string;
  defaultEmail: string;
  defaultName: string;
  ignoreTLS: boolean;
  secure: boolean;
  requireTLS: boolean;
};

export default registerAs('mail', () => {
  const mailConfig: emailConfigType = {
    port: parseInt(getValue('MAIL_PORT'), 10),
    host: getValue('MAIL_HOST'),
    user: getValue('MAIL_USER'),
    password: getValue('MAIL_PASSWORD'),
    defaultEmail: getValue('MAIL_DEFAULT_EMAIL'),
    defaultName: getValue('MAIL_DEFAULT_NAME'),
    ignoreTLS: getValue('MAIL_IGNORE_TLS') === 'true',
    secure: getValue('MAIL_SECURE') === 'true',
    requireTLS: getValue('MAIL_REQUIRE_TLS') === 'true',
  };
  return mailConfig;
});
