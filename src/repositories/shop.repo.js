'use strict';

const shopModel = require('../models/shop.model');

const selectStruct = {
  email: 1,
  name: 1,
  roles: 1,
  isVerifed: 1,
};

const findShopById = async ({ shopId, selected = selectStruct }) => {
  const shop = await shopModel.findById(shopId).select(selected);
  return shop;
};

module.exports = {
  findShopById,
};
