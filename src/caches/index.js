'use strict';

const { resolve } = require('path');
const redis = require('redis');
const { promisify } = require('util');
const { reserveInventory } = require('../repositories/inventory.repo');

const redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379,
});

// Redis version 3.1.2
const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

const accquireLock = async (productId, quantity, cartId) => {
  const key = `lock_2024:${productId}`;
  const retryTimes = 10;
  const expireTime = 3000; // 3 seconds temporarily lock

  for (let i = 0; i < retryTimes.length; i++) {
    // Create a key, who can accquire can proceed with payment
    const result = await setnxAsync(key, expireTime);
    if (result === 1) {
      // Proceed with inventory
      const inventoryReserved = await reserveInventory({
        productId,
        quantity,
        cartId,
      });
      if (inventoryReserved.modifiedCount > 0) {
        await pexpire(key, expireTime);
        return key;
      }

      return null;
    } else {
      await new Promise((resolve) =>
        setTimeout(() => {
          resolve;
        }, 50)
      );
    }
  }
};

const releaseLock = async (key) => {
  const delAsync = promisify(redisClient.del).bind(redisClient);
  return await delAsync(key);
};

module.exports = {
  accquireLock,
  releaseLock,
};
