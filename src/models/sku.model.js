'use strict';
const { Schema, model, set } = require('mongoose');
const slugify = require('slugify');
const shopModel = require('./shop.model');
const { NotFoundError } = require('../core/error.response');

const DOCUMENT_NAME = 'Sku';
const COLLECTION_NAME = 'Skus';

const skuSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },

    // [1,0], [1,1]
    /**
     * color = [red, green] = [0, 1]
     * size = [S, M, L] = [0, 1, 2]
     */
    tierIndex: { type: Array, default: [] },
    default: { type: Boolean, default: false },
    slug: { type: String, default: '' },
    sort: { type: Number, default: 0 },
    // TODO: Price needs to be in a separate model
    price: { type: Number, required: true },
    stock: { type: Number, default: 0, required: true },
    // spuId: { type: Schema.Types.ObjectId, ref: 'Spu', required: true },
    spuId: { type: String, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, skuSchema);
