'use strict';
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const KeyTokenService = require('./keyToken.service');
const { createAccessTokenPair, verifyToken } = require('../auth/authUtils');
const { getUserInfoData } = require('../utils');
const {
  BadRequestError,
  NotFoundError,
  AuthenticationFailureError,
  ForbiddenError,
} = require('../core/error.response');
const { findByEmail } = require('./shop.service');
const { $where } = require('../models/apiKey.model');

const SHOP_ROLES = {
  SHOP: 'Shop',
  WRITER: 'Writer',
  EDITOR: 'Editor',
  ADMIN: 'Admin',
};

class AccessService {
  static login = async ({ email, password, currentRefreshToken = null }) => {
    // Remember to remove old refresh token if any when user re-login
    /*
      1 - Check DB
      2 - Match password
      3 - Create access token and refresh token
      4 - Generate token
      5 - Return value
    */
    // 1
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError('Error: Email is not exist');
    // 2
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match)
      throw new AuthenticationFailureError('Error: Authentication failed');
    // 3
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');
    // 4
    const { accessToken, refreshToken } = await createAccessTokenPair(
      {
        userId: foundShop._id,
        email,
      },
      publicKey,
      privateKey
    );
    const keyTokenStored = await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      privateKey,
      publicKey,
      refreshToken,
    });
    if (!keyTokenStored)
      throw new BadRequestError('Error: Key token failed to create');
    // 5
    return {
      shop: getUserInfoData({
        object: foundShop,
        fields: ['_id', 'name', 'email'],
      }),
      accessToken,
      refreshToken,
    };
  };

  static signUp = async ({ name, email, password, roles }) => {
    /**
     * Create a new shop with given email
     * 1. Check email is exist
     * 2. Hash password
     * 3. Create private, public key, token
     * 4. Return shop object
     */

    const shopHolder = await shopModel.findOne({ email }).lean(); // Return a normal Javascript object
    if (shopHolder) throw new BadRequestError('Error: Email is already exist');

    const passwordHashed = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHashed,
      roles: SHOP_ROLES['SHOP'],
    });
    if (newShop) {
      // Created private key and public key for each shop/user
      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');

      const { accessToken, refreshToken } = await createAccessTokenPair(
        {
          userId: newShop._id,
          email,
        },
        publicKey,
        privateKey
      );

      // Return the public key string when token is with that public key is stored inside database
      const keyTokenStored = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        privateKey,
        publicKey,
        refreshToken,
      });
      if (!keyTokenStored)
        throw new BadRequestError('Error: Key token failed to create');
      return {
        shop: getUserInfoData({
          object: newShop,
          fields: ['_id', 'name', 'email'],
        }),
        accessToken,
        refreshToken,
      };
    } else throw new BadRequestError('Error: Failed to create shop');
  };

  static logout = async (keyToken) => {
    const deletedToken = await KeyTokenService.removeKeyById(keyToken._id);
    return deletedToken;
  };

  static handleRefreshToken = async (refreshToken) => {
    /**
     * Check if this token is blacklist ?
     *
     */
    const foundToken = await KeyTokenService.findByOldRefreshToken(
      refreshToken
    );
    if (foundToken) {
      // Check who you are
      const { userId } = await verifyToken(refreshToken, foundToken.publicKey);
      // Delete old key in key store belong to user ← You might be compromised
      await KeyTokenService.removeKeyByUser(userId);
      throw new ForbiddenError('Error: Something wrong happend !!!');
    }

    // If not found, normal flow
    const holderToken = await KeyTokenService.findByCurrentRefreshToken(
      refreshToken
    );
    console.log(holderToken);
    if (!holderToken)
      throw new AuthenticationFailureError('Error: Shop not registered 1 ');

    // Verify token
    const { userId, email } = await verifyToken(
      refreshToken,
      holderToken.publicKey
    );
    const foundShop = await findByEmail({ email });
    if (!foundShop)
      throw new AuthenticationFailureError('Error: Shop not registered 2');

    // Create new token pair
    const { refreshToken: newRefreshToken, accessToken: newAccessToken } =
      await createAccessTokenPair(
        { userId, email },
        holderToken.publicKey,
        holderToken.privateKey
      );

    // Update the holderToken instance
    // holderToken.currentRefreshToken = newRefreshToken;
    // holderToken.refreshTokens.push(refreshToken);

    // await holderToken.save();
    await holderToken.updateOne({
      $set: {
        currentRefreshToken: newRefreshToken,
      },
      $addToSet: {
        expiredRefreshTokens: refreshToken,
      },
    });

    return {
      user: { userId, email },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };

    // if (!foundToken) throw new NotFoundError('Error: Not found token');
    // // Delete all token in DB
    // await KeyTokenService.removeKeyById(foundToken._id);
    // await KeyTokenService.removeKeyById(keyToken._id);
    // return { refreshToken };
  };
}

module.exports = AccessService;
