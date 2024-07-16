'use strict';
const { BadRequestError } = require('../../core/error.response');
const {
  furnitureModel,
  clothingModel,
  electronicModel,
  productModel,
} = require('../../models/product.model');
const {
  findAllDraftsForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductsByUser,
} = require('../../repositories/product.repo');

// Base abstract product class
class Product {
  constructor({
    productName,
    productThumb,
    productDescription,
    productPrice,
    productQuantity,
    productType,
    productShop,
    productAttributes,
  }) {
    this.productName = productName;
    this.productThumb = productThumb;
    this.productDescription = productDescription;
    this.productPrice = productPrice;
    this.productQuantity = productQuantity;
    this.productType = productType;
    this.productShop = productShop;
    this.productAttributes = productAttributes;
  }

  async create(productId) {
    // Ensure ids of product shema and sub schemas are equal
    const newProduct = await productModel.create({ ...this, _id: productId });
    return newProduct;
  }
}

// Sub-class for different product types
class Clothing extends Product {
  constructor(product) {
    super(product);
  }

  async create() {
    const newClothing = await clothingModel.create({
      ...this.productAttributes,
      productShop: this.productShop,
    });
    if (!newClothing)
      throw new BadRequestError(
        'Error: Fail to create new clothing attributes'
      );

    const newProduct = await super.create(newClothing._id);
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
    const newElectronic = await electronicModel.create({
      ...this.productAttributes,
      productShop: this.productShop,
    });
    if (!newElectronic)
      throw new BadRequestError(
        'Error: Fail to create new electronic attributes'
      );

    const newProduct = await super.create(newElectronic._id);
    if (!newProduct)
      throw new BadRequestError('Error: Fail to create new electronic product');

    return newProduct;
  }
}

class Furniture extends Product {
  constructor(product) {
    super(product);
  }

  async create() {
    const newFurniture = await furnitureModel.create({
      ...this.productAttributes,
      productShop: this.productShop,
    });
    if (!newFurniture)
      throw new BadRequestError(
        'Error: Fail to create new electronic attributes'
      );

    const newProduct = await super.create(newFurniture._id);
    if (!newProduct)
      throw new BadRequestError('Error: Fail to create new electronic product');

    return newProduct;
  }
}

// Factory class to create product - Design pattern: Factory + Strategy
class ProductFactory {
  static productRegistry = {
    // key: productType, value: class
    // Clothing,
    // Electronic,
    // Furniture,
  };

  static registerProductType(type, refClass) {
    this.productRegistry[type] = refClass;
  }

  /**
   * type: productType
   * payload
   */
  static async createProduct(type, payload) {
    const productClass = this.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Error: Invalid product ${type}`);

    return new productClass(payload).create();
  }

  static async publishProductByShop({ shopId, productId }) {
    return await publishProductByShop({ shopId, productId });
  }

  static async unPublishProductByShop({ shopId, productId }) {
    return await unPublishProductByShop({ shopId, productId });
  }

  static async getAllDraftsForShop({ shopId, limit = 50, skip = 0 }) {
    const query = { productShop: shopId, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async getAllPublishForShop({ shopId, limit = 50, skip = 0 }) {
    const query = { productShop: shopId, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async searchProductsByUser({ searchKey }) {
    return await searchProductsByUser({ searchKey });
  }
}

// Register product types
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
