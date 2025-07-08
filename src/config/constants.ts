import { join } from 'path';

export const API_PREFIX = 'api/v1';

export const STATIC_INTEGRAL_PATH = {
  root: join(__dirname, '..', '..', 'public', 'integral'),
  prefix: `/${API_PREFIX}/integral`,
};

export const CORS_OPTIONS = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
