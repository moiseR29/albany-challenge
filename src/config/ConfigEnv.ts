import { Config } from './Config';
import * as dotenv from 'dotenv';

dotenv.config({ path: `${__dirname.split('/build')[0]}/.env` });

export const DevelopConfig: Config = {
  database: {
    port: 5432,
    user: 'albany',
    password: 'challenge',
    database: 'dev',
    host: process.env.NODE_ENV
      ? process.env.HOST_DB_DOCKER!
      : process.env.HOST_DB!,
  },
  session: {
    salt: 10,
    secret: 'supersecretisimo',
  },
  server: {
    port: 8080,
    basePath: '/api',
    env: 'dev',
  },
};

export const TestConfig: Config = {
  database: {
    port: 5432,
    user: 'albany',
    password: 'challenge',
    database: 'test',
    host: 'localhost',
  },
  session: {
    salt: 10,
    secret: 'supersecretisimo',
  },
  server: {
    port: 8080,
    basePath: '/api',
    env: 'test',
  },
};

export const DefaultConfig: Config = {
  database: {
    port: 5432,
    user: 'albany',
    password: 'challenge',
    database: 'dev',
    host: process.env.NODE_ENV
      ? process.env.HOST_DB_DOCKER!
      : process.env.HOST_DB!,
  },
  session: {
    salt: 10,
    secret: 'supersecretisimo',
  },
  server: {
    port: 8080,
    basePath: '/api',
    env: 'default',
  },
};
