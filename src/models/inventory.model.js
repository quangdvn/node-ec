'use strict';
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const inventorySchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    location: {
      type: String,
      default: 'Unknown',
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock must be above 0'],
    },
    shop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    /**
     * cartId
     * stock
     * createdOn
     */
    reservations: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, inventorySchema);
