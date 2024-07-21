'use strict';
const { Types } = require('mongoose');
const inventoryModel = require('../models/inventory.model');

const insertToInventory = async ({
  productId,
  shopId,
  stock,
  location = 'Unknown',
}) => {
  return await inventoryModel.create({
    product: productId,
    shop: shopId,
    stock,
    location,
  });
};

module.exports = {
  insertToInventory,
};
