'use strict';
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Comment';
const COLLECTION_NAME = 'Comments';

const commentSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    user: { type: Number, required: true, default: 1 },
    content: { type: String, required: true, default: '' },
    left: { type: Number, required: true, default: 0 },
    right: { type: Number, required: true, default: 0 },
    parent: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME },
    isDeleted: { type: Boolean, default: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, commentSchema);
