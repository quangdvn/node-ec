'use strict';

const { SuccessResponse } = require('../core/success.response');
const { getCache } = require('../repositories/cache.repo');
const { CACHE_PRODUCT } = require('../utils/constants');

const readFromCache = async (req, res, next) => {
  const { skuId } = req.query;
  const skuKeyCache = `${CACHE_PRODUCT.SKU}${skuId}`;
  let foundSku = await getCache({ key: skuKeyCache });

  if (!foundSku) return next();
  else {
    if (foundSku.isExplicitNull) {
      return new SuccessResponse({
        message: 'Get SPU successfully',
        metadata: {
          sku: null,
          toLoad: 'cache', // or 'db'
        },
      }).send(res);
    }
    return new SuccessResponse({
      message: 'Get SPU successfully',
      metadata: {
        ...foundSku,
        toLoad: 'cache', // or 'db'
      },
    }).send(res);
  }
};

module.exports = {
  readFromCache,
};
