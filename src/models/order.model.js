'use strict';
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

const orderSchema = new Schema(
  {
    user: {
      type: Number,
    },
    /**
     * checkout: {
     *   totalPrice,
     *   feeShip,
     *   totalCheckout,
     * }
     */
    checkout: {
      type: Object,
      default: {},
    },
    /**
     * street, city, state, country, zipcode
     */
    shipping: {
      type: Object,
      default: {},
    },
    // Cash, card, prepaid, postpaid, ...
    payment: {
      type: Object,
      default: {},
    },
    products: {
      type: Array,
      required: true,
      default: [],
    },
    trackingNumber: {
      type: String,
      default: '#00001',
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, orderSchema);
