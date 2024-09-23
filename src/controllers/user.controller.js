'use strict';
const { SuccessResponse } = require('../core/success.response');
const {
  validateNewUser,
  checkRegisterEmailToken,
} = require('../services/user.service');

class UserController {
  validateNew = async (req, res, next) => {
    new SuccessResponse({
      message: 'Send validation successfully',
      metadata: await validateNewUser({
        email: req.body.email,
      }),
    }).send(res);
  };

  checkRegisterEmailToken = async (req, res, next) => {
    const { token = null } = req.query;
    new SuccessResponse({
      message: 'Verify email successfully',
      metadata: await checkRegisterEmailToken({ token }),
    }).send(res);
  };
}

module.exports = new UserController();
