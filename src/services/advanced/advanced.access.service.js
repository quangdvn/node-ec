'use strict';
const shopModel = require('../../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('../keyToken.service');
const { createAccessTokenPair } = require('../../auth/authUtils');
const { getUserInfoData } = require('../../utils');

const SHOP_ROLES = {
  SHOP: 'Shop',
  WRITER: 'Writer',
  EDITOR: 'Editor',
  ADMIN: 'Admin',
};

class AccessService {
  static signUp = async ({ name, email, password, roles }) => {
    try {
      const shopHolder = await shopModel.findOne({ email }).lean(); // Return a normal Javascript object
      if (shopHolder) {
        return {
          code: 'xxxx',
          message: 'Email is already exist',
          status: 'error',
        };
      }

      const passwordHashed = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHashed,
        roles: SHOP_ROLES['SHOP'],
      });
      if (newShop) {
        // Created private key and public key
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'pkcs1', // Public key cryptography standard 1
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
        });

        // Return the public key string when token is with that public key is stored inside database
        const keyTokenStored = await KeyTokenService.createKeyToken({
          user: newShop._id,
          publicKey,
        });

        if (!keyTokenStored) {
          return {
            code: 'xxxx',
            message: 'Key token not created',
            status: 'error',
          };
        }

        const tokens = await createAccessTokenPair(
          {
            userId: newShop._id,
            email,
          },
          publicKey,
          privateKey
        );
        console.log('Token created successfully', tokens);

        return {
          code: 201,
          metadata: {
            shop: getUserInfoData({
              object: newShop,
              fields: ['_id', 'name', 'email'],
            }),
            tokens,
          },
        };
      }
      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: 'xyz',
        message: error.message,
        status: 'error',
      };
    }
  };
}

module.exports = AccessService;
