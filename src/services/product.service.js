'use strict';
const { BadRequestError } = require('../core/error.response');
const {
  productModel,
  clothingModel,
  electronicModel,
} = require('../models/product.model');

// Base abstract product class
class Product {
  /**
   *  productName: { type: String, required: true },
      productThumb: { type: String, required: true },
      productDescription: { type: String },
      productPrice: { type: Number, required: true },
      productQuantity: { type: Number, required: true },
      productType: {
        type: String,
        required: true,
        enum: ['Electronics', 'Clothing', 'Furniture'],
      },
      productShop: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop',
      },
      productAttributes: {
        type: Schema.Types.Mixed, // Mixed type allows storing any type of data
      },
   */
  constructor({
    productName,
    productThumb,
    productDescription,
    productPrice,
    productQuantity,
    productType,
    productShop,
    productAtributes,
  }) {
    this.productName = productName;
    this.productThumb = productThumb;
    this.productDescription = productDescription;
    this.productPrice = productPrice;
    this.productQuantity = productQuantity;
    this.productType = productType;
    this.productShop = productShop;
    this.productAtributes = productAtributes;
  }

  async create() {
    const newProduct = await productModel.create(this);
    return newProduct;
  }
}

// Sub-class for different product types
class Clothing extends Product {
  constructor(product) {
    super(product);
  }

  async create() {
    const newClothing = await clothingModel.create(this.productAtributes);
    if (!newClothing)
      throw new BadRequestError(
        'Error: Fail to create new clothing attributes'
      );

    const newProduct = await super.create();
    if (!newProduct)
      throw new BadRequestError('Error: Fail to create new clothing product');

    return newProduct;
  }
}

class Electronic extends Product {
  constructor(product) {
    super(product);
  }

  async create() {
    const newElectronic = await electronicModel.create(this.productAtributes);
    if (!newElectronic)
      throw new BadRequestError(
        'Error: Fail to create new electronic attributes'
      );

    const newProduct = await super.create();
    if (!newProduct)
      throw new BadRequestError('Error: Fail to create new electronic product');

    return newProduct;
  }
}

// Factory class to create product
class ProductFactory {
  /**
   * type: productType
   * payload
   */
  static async createProduct(type, payload) {
    switch (type) {
      case 'Clothing':
        return new Clothing(payload).create();
      case 'Electronic':
        return new Electronic(payload).create();
      default:
        throw new BadRequestError(`Error: Invalid product ${type}`);
    }
  }
}

module.exports = ProductFactory;
