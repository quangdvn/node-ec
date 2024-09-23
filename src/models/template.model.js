'use strict';
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Template';
const COLLECTION_NAME = 'Templates';

const templateSchema = new Schema(
  {
    // id: { type: Number, required: true },
    name: { type: String, required: true, unique: true },
    status: { type: String, default: 'active' },
    html: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, templateSchema);
