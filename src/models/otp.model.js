'use strict';
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Otp';
const COLLECTION_NAME = 'Otps';

const otpSchema = new Schema(
  {
    token: { type: String, required: true },
    email: { type: String, required: true },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'verified', 'block'],
    },
    expireAt: {
      type: Date,
      default: Date.now,
      expires: 60, // 1min
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, otpSchema);
