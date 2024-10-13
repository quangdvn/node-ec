'use strict';

const { resolve } = require('path');
const Redis = require('ioredis');
const { promisify } = require('util');
const { reserveInventory } = require('../repositories/inventory.repo');
const { RedisTimeoutError } = require('../core/error.response');

let client = {},
  connectionTimeout;

const CONNECT_STATUS = {
  CONNECT: 'connect',
  END: 'end',
  RECONNECT: 'reconnect',
  ERROR: 'error',
  CLOSE: 'close',
};

const CONNECTION_TIMEOUT = 60000;

const CONNECT_MESSAGE = {
  code: -99,
  message: 'Failed to connect to Redis ...',
};

// Track if a timeout is already set to avoid multiple timeouts
let timeoutActive = false;

const handleTimeoutError = () => {
  if (!timeoutActive) {
    // Only set a timeout if one is not already active
    timeoutActive = true;
    connectionTimeout = setTimeout(() => {
      timeoutActive = false;
      throw new RedisTimeoutError(CONNECT_MESSAGE.message);
    }, CONNECTION_TIMEOUT);
  }
};

const handleConnectEvent = (redisConnection) => {
  redisConnection.on(CONNECT_STATUS.CONNECT, () => {
    console.log(`IORedis - Status: Connected`);
    clearTimeout(connectionTimeout);
    timeoutActive = false; // Reset timeout tracking
  });
  redisConnection.on(CONNECT_STATUS.END, () => {
    console.log(`IORedis - Status: Disconnected`);
    // Retry
    handleTimeoutError();
  });
  redisConnection.on(CONNECT_STATUS.RECONNECT, () => {
    console.log(`IORedis - Status: Reconnecting`);
    clearTimeout(connectionTimeout);
    timeoutActive = false; // Reset timeout tracking
  });
  redisConnection.on(CONNECT_STATUS.ERROR, (err) => {
    console.log(`IORedis - Status: Error - Error: ${err}`);
    handleTimeoutError();
  });
};

const initIORedis = async ({
  IOREDIS_IS_ENABLED,
  IOREDIS_HOST = process.env.IOREDIS_HOST,
  IOREDIS_PORT = 6379,
}) => {
  if (IOREDIS_IS_ENABLED) {
    const redisInstance = new Redis({
      host: IOREDIS_HOST,
      port: IOREDIS_PORT,
    });
    handleConnectEvent(redisInstance);
    client.instance = redisInstance;
  }
};

const getIORedis = () => client.instance;

const closeIORedis = async () => {
  await client.instance.quit();
  console.log('Disconnected from Redis');
};

module.exports = {
  initIORedis,
  getIORedis,
  closeIORedis,
};
