'use strict';
const _ = require('lodash');
const { NotFoundError } = require('../core/error.response');
const skuModel = require('../models/sku.model');
const { randomProductId } = require('../utils');

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
      // TODO: Read from cache before hitting DB
      const sku = await skuModel.findOne({ _id: skuId, spuId }).lean(); // Convert to JSON for lodash
      if (!sku) throw new NotFoundError('Sku not found');

      // TODO: Set to cache
      return _.omit(sku, ['__v', 'updatedAt', 'createdAt', 'isDeleted']);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SkuService;
