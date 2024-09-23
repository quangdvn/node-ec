'use strict';
const { randomInt } = require('crypto');
const otpModel = require('../models/otp.model');

const generateRandomToken = () => {
  return randomInt(0, Math.pow(2, 32));
};

const newOtp = async ({ email }) => {
  const token = generateRandomToken();
  const newOtp = await otpModel.create({ token, email });
  return newOtp;
};

module.exports = {
  newOtp,
};
