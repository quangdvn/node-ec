'use strict';
const _ = require('lodash');
const { NotFoundError } = require('../core/error.response');
const spuModel = require('../models/spu.model');
const { findShopById } = require('../repositories/shop.repo');
const { randomProductId } = require('../utils');
const SkuService = require('./sku.service');

class SpuService {
  static async newSpu({
    productName,
    productThumb,
    productDescription,
    productPrice,
    productQuantity,
    productCategory,
    productShop,
    productAttributes,
    productVariation,
    skuList = [],
  }) {
    try {
      // 1. Check if this Shop exists
      const foundShop = await findShopById({
        shopId: productShop,
      });
      if (!foundShop) throw new NotFoundError('Error: Invalid shop');
      // 2. Check if this Product exists

      // 3. Create new SPU
      const spu = await spuModel.create({
        productId: randomProductId(),
        productName,
        productThumb,
        productDescription,
        productPrice,
        productQuantity,
        productShop,
        productCategory,
        productAttributes,
        productVariation,
      });

      if (spu && skuList.length) {
        // 4. Create Skus
        const skus = await SkuService.newSku({
          spuId: spu.productId,
          skuList,
        });
      }

      // 4. Sync data to ElasticSearch

      // 5. Return response
      return spu;
    } catch (err) {
      console.error(err);
    }
  }

  static async oneSpu({ spuId }) {
    try {
      const spu = await spuModel.findOne({
        productId: spuId,
        isPublished: false,
      });

      if (!spu) throw new NotFoundError('Error: Invalid product');

      const skus = await SkuService.allSkusByProduct({ spuId: spu.productId });
      return {
        spu: _.omit(spu, ['__v', 'updatedAt', 'createdAt', 'isDeleted']),
        skuList: skus.map((sku) =>
          _.omit(sku, ['__v', 'updatedAt', 'createdAt', 'isDeleted'])
        ),
      };
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = SpuService;
