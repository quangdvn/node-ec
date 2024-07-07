'use strict';
const keyTokenModel = require('../models/keyToken.model');
const { Types } = require('mongoose');

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

  static findByUserId = async (userId) => {
    return await keyTokenModel
      .findOne({ user: Types.ObjectId.createFromHexString(userId) })
      .lean();
  };

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne({ _id: id });
  };

  static findByOldRefreshToken = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ expiredRefreshTokens: refreshToken })
      .lean();
  };

  static findByCurrentRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ currentRefreshToken: refreshToken });
  };

  static removeKeyByUser = async (userId) => {
    return await keyTokenModel.findOneAndDelete({
      user: Types.ObjectId.createFromHexString(userId),
    });
  };
}

module.exports = KeyTokenService;
