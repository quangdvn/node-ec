'use strict';
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'User';

const userSchema = new Schema(
  {
    id: { type: Number, required: true },
    slug: { type: String, required: true },
    name: { type: String, default: '' },
    password: { type: String, default: '' },
    salt: { type: String, default: '' },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    sex: { type: String, default: '' },
    avatar: { type: String, default: '' },
    dob: { type: Date, default: null },
    role: { type: Schema.Types.ObjectId, ref: 'Role' }, // TODO: Create Role model later
    status: {
      type: String,
      default: 'PENDING',
      enum: ['PENDING', 'ACTIVE', 'BLOCK'],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, userSchema);
