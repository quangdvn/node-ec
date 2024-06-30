'use strict';
const apiKeyModel = require('../models/apiKey.model');

const findById = async (key) => {
  try {
    return await apiKeyModel.findOne({ key, status: true }).lean();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  findById,
};
