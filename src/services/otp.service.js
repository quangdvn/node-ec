'use strict';
const { randomInt } = require('crypto');
const otpModel = require('../models/otp.model');
const { NotFoundError } = require('../core/error.response');

const generateRandomToken = () => {
  return randomInt(0, Math.pow(2, 32));
};

const newOtp = async ({ email }) => {
  const token = generateRandomToken();
  const newOtp = await otpModel.create({ token, email });
  return newOtp;
};

const checkValidOtp = async ({ token }) => {
  const otp = await otpModel.findOne({ token });
  if (!otp) throw new NotFoundError('Error: Token not found');

  // Delete token from DB
  await otpModel.deleteOne({ token });

  return otp;
};

module.exports = {
  newOtp,
  checkValidOtp,
};
