'use strict';
// const { accquireLock, releaseLock } = require('../caches');
const { BadRequestError, NotFoundError } = require('../core/error.response');
const cartModel = require('../models/cart.model');
const orderModel = require('../models/order.model');
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
  // TODO: This action should be logged (or locked)
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

  static async orderByUser({
    currentCart,
    cartId,
    userId,
    userAddress = {},
    userPayment = {},
  }) {
    const { finalCart, checkoutOrder } = await CheckoutService.reviewCheckout({
      cartId,
      userId,
      currentCart,
    });
    console.log('1', finalCart);

    // Check for product in inventory
    const products = finalCart.flatMap((shop) => shop.items);

    console.log('2', products);

    const accquireProducts = [];
    // for (let i = 0; i < products.length; i++) {
    //   const { productId, quantity } = products[i];
    //   const keyLock = await accquireLock(productId, quantity, cartId);
    //   accquireProducts.push(keyLock ? true : false);
    //   if (keyLock) {
    //     await releaseLock(keyLock);
    //   }
    // }

    // If an product with 0 sku if found
    if (accquireProducts.includes(false)) {
      throw new BadRequestError('Error: Product out of stock found');
    }

    const newOrder = await orderModel.create({
      user: userId,
      checkout: checkoutOrder,
      shippingAddress: userAddress,
      payment: userPayment,
      products: finalCart,
    });

    // If order is created successfully, remove products from cart
    if (newOrder) {
      // Remove products from cart
    }

    return newOrder;
  }

  // Users
  static async getOrdersByUser() {}

  // Users
  static async getOrderByUser() {}

  // Users
  static async cancelOrderByUser() {}

  // Shop / Admin
  static async updateOrderByShop() {}

  // static async startPayment() {

  // }

  static async confirmPayment() {}
}

module.exports = CheckoutService;
