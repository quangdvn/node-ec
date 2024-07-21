'use strict';
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

const discountSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    type: {
      type: String,
      enum: ['fixed', 'percent'],
      required: true,
      default: 'fixed',
    },
    value: { type: Number, required: true },
    code: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    maxUses: { type: Number, required: true },
    maxUsesPerUser: { type: Number, required: true, default: 1 },
    usedCount: { type: Number, default: 0 },
    usedByUsers: { type: Array, default: [] },
    minOrderValue: { type: Number, required: true, default: 0 },
    shop: { type: Schema.Types.ObjectId, required: true, ref: 'Shop' },
    appliedProducts: { type: Array, default: [] },

    // Boolean fields
    isActive: { type: Boolean, default: true },
    appliesTo: { type: String, enum: ['all', 'specific'], default: 'all' },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, discountSchema);
