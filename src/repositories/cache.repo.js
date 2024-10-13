'use strict';

const { BadRequestError } = require('../core/error.response');
const { getIORedis } = require('../databases/ioredis.init');
const redisCache = getIORedis();

const setCache = async ({ key, value }) => {
  try {
    if (!redisCache) {
      throw new BadRequestError('Error: Cache is noot initialized');
    }
    await redisCache.set(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting cache:', error);
    throw new Error(`${error.message}`);
  }
};

const setCacheWithExpiration = async ({ key, value, expirationInSeconds }) => {
  try {
    if (!redisCache) {
      throw new BadRequestError('Error: Cache is noot initialized');
    }
    await redisCache.set(key, JSON.stringify(value), 'EX', expirationInSeconds);
  } catch (error) {
    console.error('Error setting cache:', error);
    throw new Error(`${error.message}`);
  }
};

const getCache = async ({ key }) => {
  try {
    if (!redisCache) {
      throw new BadRequestError('Error: Cache is noot initialized');
    }
    const data = await redisCache.get(key);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error setting cache:', error);
    throw new Error(`${error.message}`);
  }
};

module.exports = {
  setCache,
  setCacheWithExpiration,
  getCache,
};
