'use strict';

const { BadRequestError } = require('../core/error.response');
const inventoryModel = require('../models/inventory.model');
const { insertToInventory } = require('../repositories/inventory.repo');
const { findProductById } = require('../repositories/product.repo');

class InventoryService {
  static async addStockToInventory(
    stock,
    productId,
    shopId,
    location = 'Ha Noi'
  ) {
    const product = await findProductById(productId);
    if (!product) {
      throw new BadRequestError('Product not found');
    }
    const query = {
        shop: shopId,
        product: productId,
      },
      updateSet = {
        $inc: {
          inventory_stock: stock,
        },
        $set: {
          location: location,
        },
      },
      options = { upsert: true, new: true };
    return await inventoryModel.findOneAndUpdate(query, updateSet, options);
  }
}

module.exports = InventoryService;
