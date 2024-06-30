'use strict';
const keyTokenModel = require('../models/keyToken.model');

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    privateKey,
    publicKey,
    refreshToken,
  }) => {
    try {
      // Beginner

      // const token = await keyTokenModel.create({
      //   user: userId,
      //   privateKey,
      //   publicKey,
      // });

      // Advanced
      const filterParameters = {
          user: userId,
        },
        update = {
          privateKey,
          publicKey,
          expiredRefreshTokens: [],
          currentRefreshToken: refreshToken,
        },
        options = {
          upsert: true,
          new: true,
        };
      // Atomic operator
      const tokens = await keyTokenModel.findOneAndUpdate(
        filterParameters,
        update,
        options
      );

      return tokens ? tokens.publicKey : false;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
