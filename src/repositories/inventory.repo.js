'use strict';
const { Types } = require('mongoose');
const inventoryModel = require('../models/inventory.model');
const { convertToMongoDBObjectId } = require('../utils');

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

const reserveInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      product: convertToMongoDBObjectId(productId),
      stock: { $gte: quantity },
    },
    updateSet = {
      $inc: {
        stock: -quantity,
      },
      $push: {
        reservations: {
          quantity,
          cartId,
          createdOn: new Date(),
        },
      },
    },
    options = { new: true, upsert: true };
  return await inventoryModel.updateOne(query, updateSet, options);
};

module.exports = {
  insertToInventory,
  reserveInventory,
};
