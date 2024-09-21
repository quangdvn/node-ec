'use strict';
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Resource';
const COLLECTION_NAME = 'Resources';

const resourceSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, default: '' },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, resourceSchema);
