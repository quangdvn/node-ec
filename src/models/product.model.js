'use strict';
const { Schema, model, set } = require('mongoose');
const slugify = require('slugify');
const shopModel = require('./shop.model');
const { NotFoundError } = require('../core/error.response');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema(
  {
    productName: { type: String, required: true },
    productThumb: { type: String, required: true },
    productDescription: { type: String },
    productPrice: { type: Number, required: true },
    productQuantity: { type: Number, required: true },
    productSlug: { type: String, unique: true },
    productType: {
      type: String,
      required: true,
      enum: ['Electronic', 'Clothing', 'Furniture'],
    },
    productShop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    productAttributes: {
      type: Schema.Types.Mixed, // Mixed type allows storing any type of data
    },

    // Advanced fields
    productAverageRating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // Rounds to one decimal place
    },
    productVariation: { type: Array, default: [] },
    // Mostly-used, should add index
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublish: { type: Boolean, default: false, index: true, select: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

// Product document middleware: runs before .save() and .create()
productSchema.pre('save', async function (next) {
  try {
    const shop = await shopModel.findById(this.productShop);
    if (shop) {
      this.productSlug = slugify(`${shop.name} ${this.productName}`, {
        lower: true,
      });
      next();
    } else {
      throw new NotFoundError('Error: Invalid shop');
    }
  } catch (err) {
    return next(err);
  }
});

// Define schema for each product type
const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
  },
  {
    collection: 'Clothes',
    timestamps: true,
  }
);

const electronicSchema = new Schema(
  {
    manufacture: { type: String, required: true },
    model: String,
    color: String,
  },
  {
    collection: 'Electronics',
    timestamps: true,
  }
);

const furnitureSchema = new Schema(
  {
    manufacture: { type: String, required: true },
    size: String,
    color: String,
  },
  {
    collection: 'Furnitures',
    timestamps: true,
  }
);

module.exports = {
  productModel: model(DOCUMENT_NAME, productSchema),
  clothingModel: model('Clothing', clothingSchema),
  electronicModel: model('Electronic', electronicSchema),
  furnitureModel: model('Furniture', furnitureSchema),
};
