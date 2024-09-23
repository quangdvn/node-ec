'use strict';

const { resolve } = require('path');
const redis = require('redis');
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
    console.log(`Redis - Status: Connected`);
    clearTimeout(connectionTimeout);
    timeoutActive = false; // Reset timeout tracking
  });
  redisConnection.on(CONNECT_STATUS.END, () => {
    console.log(`Redis - Status: Disconnected`);
    // Retry
    handleTimeoutError();
  });
  redisConnection.on(CONNECT_STATUS.RECONNECT, () => {
    console.log(`Redis - Status: Reconnecting`);
    clearTimeout(connectionTimeout);
    timeoutActive = false; // Reset timeout tracking
  });
  redisConnection.on(CONNECT_STATUS.ERROR, (err) => {
    console.log(`Redis - Status: Error - Error: ${err}`);
    handleTimeoutError();
  });
};

const initRedis = async () => {
  const redisInstance = redis.createClient({
    host: '127.0.0.1',
    port: 6379,
  });
  handleConnectEvent(redisInstance);

  client.instance = redisInstance;
};

const getRedis = () => client.instance;

const closeRedis = async () => {
  await client.instance.quit();
  console.log('Disconnected from Redis');
};

module.exports = {
  initRedis,
  getRedis,
  closeRedis,
};
