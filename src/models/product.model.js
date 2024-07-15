'use strict';
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema(
  {
    productName: { type: String, required: true },
    productThumb: { type: String, required: true },
    productDescription: { type: String },
    productPrice: { type: Number, required: true },
    productQuantity: { type: Number, required: true },
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
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

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
