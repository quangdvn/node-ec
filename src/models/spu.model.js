'use strict';
const { Schema, model, set } = require('mongoose');
const slugify = require('slugify');
const shopModel = require('./shop.model');
const { NotFoundError } = require('../core/error.response');

const DOCUMENT_NAME = 'Spu';
const COLLECTION_NAME = 'Spus';

const spuSchema = new Schema(
  {
    productId: { type: Number, required: true, unique: true },
    productName: { type: String, required: true },
    productThumb: { type: String, required: true },
    productDescription: { type: String },
    productPrice: { type: Number, required: true },
    productQuantity: { type: Number, required: true },
    productSlug: { type: String, unique: true },
    productShop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },

    // Advanced fields
    productCategories: { type: Array, required: true },
    productAttributes: {
      type: Schema.Types.Mixed, // Mixed type allows storing any type of data
    },
    /**
     * {
     *  id: 12345, // Style
     *  values: [
     *    {
     *      id: 123
     *      value: Summer
     *    },
     *    {
     *      id: 123
     *      value: Winter
     *    }
     *  ]
     * }
     */

    // Advanced fields
    productAverageRating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // Rounds to one decimal place
    },
    productVariations: { type: Array, default: [] },
    /**
     *  [
     *    {
     *      images: []
     *      name: 'color',
     *      optinos: ['red', 'blue']
     *    },
     *    {
     *      images: []
     *      name: 'size',
     *      optinos: ['M', 'L']
     *    }
     *  ]
     */

    // Mostly-used, should add index
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    isDeleted: { type: Boolean, default: false, index: true, select: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

// Create index to search
spuSchema.index({ productName: 'text', productDescription: 'text' });

// Product document middleware: runs before .save() and .create()
spuSchema.pre('save', async function (next) {
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

module.exports = model(DOCUMENT_NAME, spuSchema);
