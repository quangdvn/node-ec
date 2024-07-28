'use strict';
const { SuccessResponse } = require('../core/success.response');
const CartService = require('../services/cart.service');

class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Add to cart successfully',
      metadata: await CartService.addProductToCart(req.body),
    }).send(res);
  };

  updateCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update cart successfully',
      metadata: await CartService.addProductToCartV2(req.body),
    }).send(res);
  };

  deleteProductInCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete product in cart successfully',
      metadata: await CartService.deleteProductInCart(req.body),
    }).send(res);
  };

  getCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get cart successfully',
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
