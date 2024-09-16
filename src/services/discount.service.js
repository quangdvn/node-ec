'use strict';
const { BadRequestError, NotFoundError } = require('../core/error.response');
const discountModel = require('../models/discount.model');
const {
  findAllSelectDiscountCodes,
  findAllUnSelectDiscountCodes,
  checkExistingCode,
} = require('../repositories/discount.repo');
const { findAllProducts } = require('../repositories/product.repo');
const { convertToMongoDBObjectId } = require('../utils');
/**
 * 
 * Discount Service
    1 - Generator Discount Code [Shop | Admin]
    2 - Get all discount codes [User | Shop]
    3 - Get all product by discount code [User]
    4 - Get discount amount [User]
    5 - Delete discount code [Admin | Shop]
    6 - Cancel discount code [User]
    7 - Verify discount code [User]
 */

class DiscountService {
  static async createDiscountCode(payload) {
    try {
      const {
        name,
        description,
        type,
        value,
        code,
        startDate,
        endDate,
        maxUses,
        maxUsesPerUser,
        minOrderValue,
        shopId,
        isActive,
        appliesTo,
        listOfProducts,
      } = payload;
      // Validation check
      if (
        new Date(startDate) >= new Date(endDate) ||
        new Date() < new Date(startDate) ||
        new Date() > new Date(endDate)
      ) {
        throw new BadRequestError('Error: Invalid discount code date');
      }

      // Check if the discount code already exists
      const foundCode = await discountModel
        .findOne({
          code,
          shop: convertToMongoDBObjectId(shopId),
        })
        .lean();
      if (foundCode && foundCode.isActive) {
        throw new BadRequestError('Error: Existing discount code');
      }

      // Create a new discount code
      const discountCode = await discountModel.create({
        name,
        description,
        type,
        value,
        code,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        maxUses,
        maxUsesPerUser,
        minOrderValue: minOrderValue || 0,
        shop: shopId,
        isActive,
        appliesTo,
        appliedProducts: appliesTo === 'all' ? [] : listOfProducts,
      });

      return discountCode;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // TODO: Refactor
  static async updateDiscountCode(payload) {
    try {
      const {
        discountId,
        name,
        description,
        type,
        value,
        code,
        startDate,
        endDate,
        maxUses,
        maxUsesPerUser,
        minOrderValue,
        shopId,
        isActive,
        appliesTo,
        appliedProductIds, // TODO: Refactor
      } = payload;
      // Validation check
      if (
        new Date(startDate) >= new Date(endDate) ||
        new Date() < new Date(startDate) ||
        new Date() > new Date(endDate)
      ) {
        throw new BadRequestError('Error: Invalid discount code date');
      }

      // Check if the discount code already exists
      const foundCode = await discountModel
        .findOne({
          _id: convertToMongoDBObjectId(discountId),
          shop: convertToMongoDBObjectId(shopId),
        })
        .lean();
      if (!foundCode) {
        throw new BadRequestError('Error: Discount code not found');
      }

      // Update discount code
      const discountCode = await discountModel.findByIdAndUpdate(
        discountId,
        {
          name,
          description,
          type,
          value,
          code,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          maxUses,
          maxUsesPerUser,
          minOrderValue: minOrderValue || 0,
          shop: shopId,
          isActive,
          appliesTo,
          appliedProductIds: appliesTo === 'all' ? [] : appliedProductIds, // TODO: Refactor
        },
        { new: true }
      );

      return discountCode;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getAllProductsByDiscountCode({
    code,
    shopId,
    userId,
    limit = 50,
    page = 1,
  }) {
    /**
     * userId is optional, some code can be claimed without login
     */
    // Check if the discount code already exists
    const foundCode = await discountModel
      .findOne({
        code,
        shop: convertToMongoDBObjectId(shopId),
      })
      .lean();

    if (!foundCode || !foundCode.isActive)
      throw new NotFoundError('Error: Discount code not found');

    const { appliesTo, appliedProducts } = foundCode;
    console.log('Mine', foundCode);
    let products;
    if (appliesTo === 'all') {
      products = await findAllProducts({
        limit: +limit,
        page: +page,
        sort: 'ctime',
        filter: {
          productShop: convertToMongoDBObjectId(shopId),
          isPublished: true,
        },
        select: ['productName'],
      });
      console.log('Here', products);
    }

    if (appliesTo === 'specific') {
      products = await findAllProducts({
        limit: +limit,
        page: +page,
        sort: 'ctime',
        filter: {
          _id: { $in: appliedProducts },
          productShop: convertToMongoDBObjectId(shopId),
          isPublished: true,
        },
        select: ['productName'],
      });
    }
    return products;
  }

  static async getAllDiscountCodesByShop({ shopId, limit, page }) {
    const discountCodes = await findAllUnSelectDiscountCodes({
      limit: +limit,
      page: +page,
      filter: {
        shop: convertToMongoDBObjectId(shopId),
        isActive: true,
      },
      unSelect: ['__v', 'shop'],
    });

    return discountCodes;
  }

  /**
   * cart|products = [
   *    { productId, quantity, price},
   *    { productId, quantity, price}
   *    { productId, quantity, price}
   * ]
   *
   */
  // TODO: Need more refactor
  static async applyDiscountCode({ code, shopId, userId, products }) {
    const foundCode = await checkExistingCode({
      filter: {
        code: code,
        shop: convertToMongoDBObjectId(shopId),
      },
    });

    if (!foundCode || !foundCode.isActive)
      throw new NotFoundError('Error: Discount code not found');

    const {
      type,
      value: discountValue,
      startDate,
      endDate,
      maxUses,
      maxUsesPerUser,
      minOrderValue,
      appliesTo,
      appliedProducts,
    } = foundCode;

    // Validation check
    if (
      new Date() < new Date(startDate) ||
      new Date() > new Date(endDate) ||
      foundCode.usedByUsers.length >= maxUses
    )
      throw new BadRequestError('Error: Invalid discount code');
    /**
     *  1 - Check whether order value condition is passed
     *  2 - Check if max uses per user is over
     */
    let totalOrderValue = 0;
    if (minOrderValue > 0) {
      products.forEach((product) => {
        totalOrderValue += product.price * product.quantity;
      });

      if (totalOrderValue < minOrderValue)
        throw new BadRequestError(
          `Error: Discount code requires a minimum order value of ${minOrderValue}`
        );
    }

    //TODO: Refactor later based on data organization
    if (maxUsesPerUser > 0) {
      const userUsesCount = foundCode.usedByUsers.filter(
        (user) => user.userId === userId
      ).length;
      if (userUsesCount >= maxUsesPerUser) {
        throw new BadRequestError(
          'Error: Discount code has reached its maximum usage limit for this user'
        );
      }
    }

    //TODO: Refactor later based on data organization
    //TODO: Refactor later for specific coupon
    if (appliesTo === 'specific') {
      let isValidProduct = true;
      products.forEach((product) => {
        console.log('product', product);
        console.log('id', appliedProducts);
        if (!appliedProducts.includes(product.productId)) {
          isValidProduct = false;
        }
      });

      if (!isValidProduct) {
        throw new BadRequestError(
          'Error: Discount code is not valid for this product'
        );
      }
    }

    const amount =
      type === 'fixed'
        ? discountValue
        : totalOrderValue * (discountValue / 100);

    return {
      totalOrderValue,
      discount: amount,
      totalPrice: totalOrderValue - amount,
    };
  }

  // TODO: Normally, deleted records should be managed in a separate table
  static async deleteDiscountCode({ shopId, code }) {
    // TODO: Need to check for usedByUsers whether it is being used
    const deletedCode = await discountModel.findOneAndDelete({
      code,
      shop: convertToMongoDBObjectId(shopId),
    });

    if (!deletedCode) throw new NotFoundError('Error: Discount code not found');

    return deletedCode;
  }

  static async cancelDiscountCode({ code, shopId, userId }) {
    const foundCode = await checkExistingCode({
      filter: {
        code: code,
        shop: convertToMongoDBObjectId(shopId),
      },
    });

    // TODO: Can refactor by using Builder pattern design
    if (!foundCode || !foundCode.isActive)
      throw new NotFoundError('Error: Discount code not found');

    const result = await discountModel.findByIdAndUpdate(
      foundCode._id,
      {
        $pull: { usedByUsers: { userId } },
        $inc: { maxUses: 1, usedCount: -1 },
      },
      { new: true }
    );

    if (!result)
      throw new BadRequestError('Error: Cancel discount code failed');

    return result;
  }
}

module.exports = DiscountService;
