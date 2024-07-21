'use strict';
const { BadRequestError } = require('../../core/error.response');
const {
  furnitureModel,
  clothingModel,
  electronicModel,
  productModel,
} = require('../../models/product.model');
const { insertToInventory } = require('../../repositories/inventory.repo');
const {
  findAllDraftsForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductsByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require('../../repositories/product.repo');
const { updateNestedObjectParser } = require('../../utils');

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
    // Ensure ids of product shema and sub schemas are equal (sub schema is created first)
    const newProduct = await productModel.create({ ...this, _id: productId });

    if (newProduct) {
      await insertToInventory({
        productId: newProduct._id,
        shopId: this.productShop,
        stock: this.productQuantity,
      });
    }

    return newProduct;
  }

  async update(productId, payload) {
    return await updateProductById({ productId, payload, model: productModel });
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

  async update(productId) {
    /**
     * 1. Remove null or undefined attr
     * 2. Check whether attr is updated or only common fields are updated
     *    If object.attr -> Update child
     */
    const productPayload = this;
    // const productPayload = removeNestedUndefinedObject(this);
    // const productPayload = updateNestedObjectParser(this);
    if (productPayload.productAttributes) {
      await updateProductById({
        productId,
        payload: updateNestedObjectParser(productPayload.productAttributes),
        model: clothingModel,
      });
    }

    const updateProduct = await super.update(
      productId,
      updateNestedObjectParser(productPayload)
    );
    return updateProduct;
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

  static async updateProduct(type, productId, payload) {
    const productClass = this.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Error: Invalid product ${type}`);

    return new productClass(payload).update(productId);
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

  static async findAllProducts({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ['productName, productPrice, productThumb'],
    });
  }

  static async findProduct({ productId }) {
    return await findProduct({ productId, unSelect: ['__v'] });
  }
}

// Register product types
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
