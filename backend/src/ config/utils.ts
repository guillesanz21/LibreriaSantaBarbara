// Utils related to config
import appDefaultConfig from './app.default_config.json';

// Function that returns a value either from the environment variable or from the default config file
export const getValue = (key: string): string => {
  return process.env[key] || appDefaultConfig[key];
};
