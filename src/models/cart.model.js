'use strict';
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

const cartSchema = new Schema(
  {
    state: {
      type: String,
      required: true,
      enum: ['active', 'completed', 'pending', 'failed'],
      default: 'active',
    },
    /**
     * items: [
     *  {
     *    productId: String,
     *    shopId
     *    quantity: Number,
     *    price: Number,
     *    discount: Number,
     *    appliedPromotions: [String],
     *  }
     * ]
     */
    items: { type: Array, required: true, default: [] },
    count: { type: Number, required: true, default: 0 },
    // user: { type: Schema.Types.ObjectId, required: true, ref: 'User'} //TODO: Refactor later when user model is introduced
    user: { type: Number, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, cartSchema);
