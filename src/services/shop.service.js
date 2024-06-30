'use strict';
const shopModel = require('../models/shop.model');

const findByEmail = async ({ email, select }) => {
  const projection = select || {
    email: 1,
    password: 1,
    name: 1,
    status: 1,
    roles: 1,
  };

  return shopModel.findOne({ email }, projection).lean();
};

module.exports = {
  findByEmail,
};
