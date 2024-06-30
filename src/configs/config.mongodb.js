'use strict';

const ecConfig = {
  dev: {
    app: {
      port: process.env.DEV_APP_PORT || 3333,
    },
    database: {
      host: process.env.DEV_DB_HOST || 'localhost',
      port: process.env.DEV_DB_PORT || '27017',
      name: process.env.DEV_DB_NAME || 'quangdvn-ec',
    },
  },
  prod: {
    app: {
      port: process.env.PROD_APP_PORT,
    },
    database: {
      host: process.env.PROD_DB_HOST,
      port: process.env.PROD_DB_PORT,
      name: process.env.PROD_DB_NAME,
    },
  },
};
const ENV = process.env.NODE_ENV || 'dev';

module.exports = ecConfig[ENV];
