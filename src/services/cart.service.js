'use strict';

const { NotFoundError } = require('../core/error.response');
const cartModel = require('../models/cart.model');
const {
  createUserCart,
  updateUserCartQuantity,
} = require('../repositories/cart.repo');
const { findProductById } = require('../repositories/product.repo');

/**
  * Key features
  * Cart Service
    1 - Add product to Cart [User]
    2 - Reduce product quantity [User]
    3 - Increase product quantity [User]
    4 - Get Cart [User]
    5 - Delete cart [User]
    6 - Delete cart item [User]
*/
class CartSerivce {
  static async addProductToCart({ userId, product = {} }) {
    const userCart = await cartModel.findOne({ user: userId });
    if (!userCart) {
      // Create new cart for user, do not throw error
      return await createUserCart({ userId, product });
    }
    // If cart was empty
    if (userCart.items.length === 0) {
      userCart.items = [product];
      return await userCart.save();
    }

    // If item already in cart, update quantity
    return await updateUserCartQuantity({ userId, product });

    //? Reference to the case when new product is added to current cart
    // const itemIndex = userCart.items.findIndex(
    //   (item) => item.product.toString() === product._id.toString()
    // );

    // if (itemIndex > -1) {
    //   // Product exists in the cart, update the quantity
    //   userCart.items[itemIndex].quantity += 1;
    // } else {
    //   // Product does not exist in the cart, add it
    //   userCart.items.push({ product: product._id, quantity: 1 });
    // }

    // userCart.total += product.price;
    // return await userCart.save();
  }

  /**
   * currentCart: [
   *    {
   *      shopId,
   *      items: [
   *        {
   *          productId,
   *          quantity,
   *          price
   *         }
   *      ]
   *    }
   * ],
   * version
   */
  static async addProductToCartV2({ userId, currentCart = [] }) {
    console.log(currentCart);
    const { productId, quantity, oldQuantity } = currentCart[0]?.items[0];

    // Check product
    const foundProduct = await findProductById(productId);
    if (!foundProduct) throw new NotFoundError('Error: Product not found');

    // Compare
    if (foundProduct.productShop.toString() !== currentCart[0]?.shopId)
      throw new NotFoundError('Error: Product does not belong to shop');

    if (quantity === 0) {
      // Handle delete
    }

    return await updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - oldQuantity,
      },
    });
  }

  static async deleteProductInCart({ userId, productId = {} }) {
    const query = { user: userId, state: 'active' },
      updateSet = {
        $pull: {
          items: {
            productId,
          },
        },
      },
      options = { new: true };
    //TODO: Do not remove items from cart, store it in a different table to track user behaviour
    const deletedCart = await cartModel.updateOne(query, updateSet, options);
    return deletedCart;
  }

  static async getListUserCart({ userId }) {
    return await cartModel.findOne({ user: +userId }).lean();
  }
}

module.exports = CartSerivce;
