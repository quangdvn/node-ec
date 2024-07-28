'use strict';
const { SuccessResponse } = require('../core/success.response');
const CheckoutService = require('../services/checkout.service');

class CheckoutController {
  reviewCheckout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Done check out',
      metadata: await CheckoutService.reviewCheckout(req.body),
    }).send(res);
  };
}

module.exports = new CheckoutController();
