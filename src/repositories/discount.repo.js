'use strict';
const discountModel = require('../models/discount.model');
const { getSelectData, getUnSelectData } = require('../utils');

const findAllUnSelectDiscountCodes = async ({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter,
  unSelect,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const allCodes = await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unSelect))
    .lean()
    .exec();

  return allCodes;
};

const findAllSelectDiscountCodes = async ({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter,
  select,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const allCodes = await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    .exec();

  return allCodes;
};

const checkExistingCode = async ({ filter }) => {
  return await discountModel.findOne(filter).lean().exec();
};

module.exports = {
  findAllUnSelectDiscountCodes,
  findAllSelectDiscountCodes,
  checkExistingCode,
};
