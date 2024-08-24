'use strict';
const { Schema, model } = require('mongoose');

// System notification, not notification at user level
const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';

// ORDER-001: Order successfully
// ORDER-002: Order failed
// PROMOTION-001: New promotion for following users
// SHOP-001: New product for following users

const notificationSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'],
    },
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    receiverId: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      default: {},
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, notificationSchema);
