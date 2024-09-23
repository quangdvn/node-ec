'use strict';
const { BadRequestError } = require('../core/error.response');
const userModel = require('../models/user.model');
const { sendEmailToken } = require('./email.service');

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

module.exports = {
  validateNewUser,
};
