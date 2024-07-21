'use strict';
const {
  CreatedResponse,
  SuccessResponse,
} = require('../core/success.response');
const DiscountService = require('../services/discount.service');

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new CreatedResponse({
      message: 'Create discount code successfully',
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodesByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all discount codes successfully',
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  applyDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'Apply discount codes successfully',
      metadata: await DiscountService.applyDiscountCode({
        ...req.body,
      }),
    }).send(res);
  };

  getAllProductsByDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all products with code successfully',
      metadata: await DiscountService.getAllProductsByDiscountCode({
        ...req.query,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
