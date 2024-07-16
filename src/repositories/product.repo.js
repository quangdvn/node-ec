'use strict';

const { Types } = require('mongoose');
const { productModel } = require('../models/product.model');

const queryProducts = async (query) => {
  return await productModel
    .find(query)
    .populate('productShop', ['name', 'email', '-_id'])
    .skip(skip)
    .limit(limit)
    .sort({ updatedAt: -1 })
    .lean()
    .exec();
};

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProducts({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProducts({ query, limit, skip });
};

const publishProductByShop = async ({ shopId, productId }) => {
  const foundShop = await productModel.findOne({
    _id: Types.ObjectId.createFromHexString(productId),
    productShop: Types.ObjectId.createFromHexString(shopId),
  });

  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublished = true;

  const { modifiedCount } = await foundShop.updateOne(foundShop).exec();
  console.log('123', modifiedCount);

  return modifiedCount;
};

const unPublishProductByShop = async ({ shopId, productId }) => {
  const foundShop = await productModel.findOne({
    _id: Types.ObjectId.createFromHexString(productId),
    productShop: Types.ObjectId.createFromHexString(shopId),
  });

  if (!foundShop) return null;

  foundShop.isDraft = true;
  foundShop.isPublished = false;

  const { modifiedCount } = await foundShop.updateOne(foundShop).exec();

  return modifiedCount;
};

const searchProductsByUser = async ({ searchKey }) => {
  const regexSearch = new RegExp(searchKey, 'i');
  const results = await productModel
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean();

  return results;
};

module.exports = {
  findAllDraftsForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductsByUser,
};
