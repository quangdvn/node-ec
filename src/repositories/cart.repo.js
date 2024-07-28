'use strict';
const cartModel = require('../models/cart.model');
const { convertToMongoDBObjectId } = require('../utils');

const createUserCart = async ({ userId, product }) => {
  const query = { user: userId, state: 'active' },
    updateOrInsert = {
      $addToSet: {
        items: product,
      },
    },
    options = {
      upsert: true,
      new: true,
    };
  return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
};

const updateUserCartQuantity = async ({ userId, product }) => {
  const { productId, quantity } = product;
  console.log(product);
  const query = {
      user: userId,
      'items.productId': productId, //! MongoDB feature
      state: 'active',
    },
    updateSet = {
      $inc: {
        'items.$.quantity': quantity,
      },
    },
    options = {
      upsert: true,
      new: true,
    };
  return await cartModel.findOneAndUpdate(query, updateSet, options);
};

const findCartById = async (cartId) => {
  return await cartModel
    .findOne({ _id: convertToMongoDBObjectId(cartId), state: 'active' })
    .lean();
};

module.exports = {
  createUserCart,
  updateUserCartQuantity,
  findCartById,
};
