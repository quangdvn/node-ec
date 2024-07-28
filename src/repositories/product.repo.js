'use strict';
const { Types } = require('mongoose');
const { productModel } = require('../models/product.model');
const {
  getSelectData,
  getUnSelectData,
  convertToMongoDBObjectId,
} = require('../utils');

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

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const allProducts = await productModel
    .find(filter)
    // .sort(sortBy)
    // .skip(skip)
    // .limit(limit)
    .select(getSelectData(select))
    .lean()
    .exec();
  console.log('Params', filter);
  console.log('Params', select);
  console.log('Found smt?', allProducts);
  return allProducts;
};

const findProduct = async ({ productId, unSelect }) => {
  return await productModel
    .findById(productId)
    .select(getUnSelectData(unSelect))
    .lean()
    .exec();
};

const updateProductById = async ({
  productId,
  payload,
  model,
  isNew = true,
}) => {
  // TODO: Handle if product is not found
  return await model
    .findByIdAndUpdate(productId, payload, {
      new: isNew,
    })
    .exec();
};

const findProductById = async (productId) => {
  return await productModel
    .findOne({ _id: convertToMongoDBObjectId(productId) })
    .lean()
    .exec();
};

const checkProductByServer = async (products) => {
  return Promise.all(
    products.map(async (product) => {
      const foundProduct = await findProductById(product.productId);
      if (foundProduct) {
        return {
          price: foundProduct.productPrice,
          quantity: product.quantity,
          name: foundProduct.productName,
        };
      }
    })
  );
};

module.exports = {
  findAllDraftsForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductsByUser,
  findAllProducts,
  findProduct,
  updateProductById,
  findProductById,
  checkProductByServer,
};
