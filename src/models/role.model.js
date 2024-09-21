'use strict';
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Role';
const COLLECTION_NAME = 'Roles';

// RBAC pattern
// const adminGrantList = [
//   { resource: 'profile', actions: ['GET', 'PUT'], attributes: '*' },
//   { resource: 'balance', actions: ['GET', 'PUT'], attributes: '*,!amount' },
// ];
// const shopGrantlist = [
//   { resource: 'profile', actions: ['GET', 'PUT'], attributes: '*' },
//   { resource: 'balance', actions: ['GET', 'PUT'], attributes: '*,!amount' },
// ];
// const userGrantList = [
//   { resource: 'profile', actions: ['GET', 'PUT'], attributes: '*' },
//   { resource: 'balance', actions: ['READ'], attributes: '*' },
// ];

const roleSchema = new Schema(
  {
    name: {
      type: String,
      default: 'USER',
      enum: ['USER', 'SHOP', 'ADMIN'],
    },
    slug: { type: String, required: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'BLOCK', 'PENDING'],
      default: 'ACTIVE',
    },
    description: { type: String, default: '' },
    grants: [
      {
        resource: {
          type: Schema.Types.ObjectId,
          ref: 'Resource',
          required: true,
        },
        actions: [{ type: String, required: true }],
        attributes: { type: String, default: '*' },
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, roleSchema);
