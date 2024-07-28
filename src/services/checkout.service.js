'use strict';
const { BadRequestError, NotFoundError } = require('../core/error.response');
const cartModel = require('../models/cart.model');
const { findCartById } = require('../repositories/cart.repo');
const { checkProductByServer } = require('../repositories/product.repo');
const { applyDiscountCode } = require('./discount.service');

class CheckoutService {
  /** Request body structure
   * cartId,
   * userId,
   * currentCart: [
   *    {
   *      shopId:
   *      shopDiscounts: [],
   *      items: [
   *        { productId, quantity, price }
   *      ]
   *    },
   *    {
   *      shopId:
   *      shopDiscounts: [],
   *      items: [
   *        { productId, quantity, price }
   *      ]
   *    }
   * ]
   *
   */
  // TODO: 2 use cases - Login or without login
  // This is the middle step, after filling in the cart and before actual payment
  // Where all necessary information is checked
  static async reviewCheckout({
    cartId,
    userId,
    currentCart: currentCartByShops,
  }) {
    // check existing cart
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new NotFoundError('Error: Cart not found');

    // Final information after all discounts or feeship are applied
    const checkoutOrder = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      finalCart = [];

    // Loop for every item in each shop
    for (let i = 0; i < currentCartByShops.length; i++) {
      const { shopId, shopDiscounts = [], items = [] } = currentCartByShops[i];
      const checkProductServer = await checkProductByServer(items);
      console.log('checkProductByServer', checkProductServer);
      if (!checkProductServer[0])
        throw new BadRequestError('Error: Checkout wrong');

      // Order total price
      const checkoutPrice = checkProductServer.reduce(
        (acc, product) => acc + product.quantity * product.price,
        0
      );

      // Raw price
      checkoutOrder.totalPrice = +checkoutPrice;

      const checkoutItems = {
        shopId,
        shopDiscounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        items: checkProductServer,
      };

      // Check shop discounts
      if (shopDiscounts.length > 0) {
        // Handle 1 discount for 1 product at a time
        const { totalPrice = 0, discount = 0 } = await applyDiscountCode({
          code: shopDiscounts[0].code,
          shopId,
          userId,
          products: checkProductServer,
        });
        checkoutOrder.totalDiscount += discount;

        if (discount > 0) {
          checkoutItems.priceApplyDiscount = checkoutPrice - discount;
        }
      }
      checkoutOrder.totalCheckout += checkoutItems.priceApplyDiscount;
      finalCart.push(checkoutItems);
    }

    return {
      currentCartByShops,
      finalCart,
      checkoutOrder,
    };
  }
}

module.exports = CheckoutService;
