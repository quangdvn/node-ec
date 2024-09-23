'use strict';
const { BadRequestError } = require('../core/error.response');
const userModel = require('../models/user.model');
const { createNewUser } = require('../repositories/user.repo');
const { sendEmailToken } = require('./email.service');
const { checkValidOtp } = require('./otp.service');
const KeyTokenService = require('./keyToken.service');
const { createAccessTokenPair } = require('../auth/authUtils');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const { getUserInfoData } = require('../utils');
const { getSystemRole } = require('../repositories/role.repo');

const validateNewUser = async ({ email = null, captcha = null }) => {
  // 1. Check email exists
  // TODO: Should not do this in real system
  const foundUser = await userModel.findOne({ email }).lean();

  // 2. If exists, return error
  if (foundUser) {
    throw new BadRequestError('Error: Email already exists');
  }

  // 3. Send token via email user
  const result = await sendEmailToken({ email });
  return result;
};

const findUserByEmail = async ({ email }) => {
  const user = await userModel.findOne({ email }).lean();
  return user;
};

const checkRegisterEmailToken = async ({ token }) => {
  // 1. Check token in db
  const { email: foundEmail, token: foundToken } = await checkValidOtp({
    token,
  });
  if (!foundEmail || !foundToken) {
    throw new BadRequestError('Error: Invalid token');
  }

  // 2. Check existing email
  const foundUser = await findUserByEmail({ email: foundEmail });
  if (foundUser) throw new BadRequestError('Error: Email already exists');

  // 3. Create new user
  const passwordHashed = await bcrypt.hash(foundEmail, 10); // Create a default email
  const userRole = await getSystemRole({ roleName: 'USER' });
  const newUser = await createNewUser({
    name: foundEmail,
    email: foundEmail,
    slug: 'quangdvn',
    password: passwordHashed,
    role: userRole._id,
  });
  if (newUser) {
    // Created private key and public key for each user
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    const { accessToken, refreshToken } = await createAccessTokenPair(
      {
        userId: newUser._id,
        foundEmail,
      },
      publicKey,
      privateKey
    );

    // Return the public key string when token is with that public key is stored inside database
    const keyTokenStored = await KeyTokenService.createKeyToken({
      userId: newUser._id,
      privateKey,
      publicKey,
      refreshToken,
    });
    if (!keyTokenStored)
      throw new BadRequestError('Error: Key token failed to create');

    return {
      user: getUserInfoData({
        object: newUser,
        fields: ['_id', 'name', 'email'],
      }),
      accessToken,
      refreshToken,
    };
  }
};

module.exports = {
  validateNewUser,
  checkRegisterEmailToken,
};
