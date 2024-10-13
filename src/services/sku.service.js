'use strict';
const _ = require('lodash');
const skuModel = require('../models/sku.model');
const { randomProductId } = require('../utils');
const { setCacheWithExpiration } = require('../repositories/cache.repo');
const { EXPLICIT_NULL, CACHE_PRODUCT } = require('../utils/constants');

class SkuService {
  static async newSku({ spuId, skuList = [] }) {
    try {
      const convertedSkuList = skuList.map((sku) => {
        return {
          ...sku,
          id: `${spuId}-${randomProductId()}`,
          spuId: spuId,
        };
      });
      const skus = await skuModel.create(convertedSkuList);
      return skus;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  static async allSkusByProduct({ spuId }) {
    try {
      // 1. Check if spu exists

      // 2.
      const skus = await skuModel.find({ spuId }).lean();
      return skus;
    } catch (error) {
      throw error;
    }
  }

  static async oneSku({ skuId, spuId }) {
    try {
      // 1. Check params - Can put to middleware
      if (skuId <= 0 || spuId <= 0) return null;

      // 2. Hit cache - Moved to middleware
      const skuKeyCache = `${CACHE_PRODUCT.SKU}${skuId}`;

      // let foundSku = await getCache({ key: skuKeyCache });
      // console.log('foundSku', foundSku);
      // if (foundSku) {
      //   if (foundSku.isExplicitNull) {
      //     return {
      //       sku: null,
      //       toLoad: 'cache', // or 'db'
      //     };
      //   }
      //   return {
      //     ...foundSku,
      //     toLoad: 'cache', // or 'db'
      //   };
      // } else {
      // 3. Hit DB
      const foundSku = await skuModel.findOne({ _id: skuId, spuId }).lean(); // Convert to JSON for lodash

      const cacheValue = foundSku
        ? _.omit(foundSku, ['__v', 'updatedAt', 'createdAt', 'isDeleted'])
        : EXPLICIT_NULL;
      await setCacheWithExpiration({
        key: skuKeyCache,
        value: cacheValue,
        expirationInSeconds: 30,
      });

      return {
        ...cacheValue,
        toLoad: 'db',
      };

      // if (!sku) throw new NotFoundError('Sku not found');
      // return _.omit(sku, ['__v', 'updatedAt', 'createdAt', 'isDeleted']);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SkuService;
