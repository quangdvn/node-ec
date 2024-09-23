'use strict';
const { SuccessResponse } = require('../core/success.response');
const { validateNewUser } = require('../services/user.service');

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
    new SuccessResponse({
      message: 'Check register email token successfully',
    }).send(res);
  };
}

module.exports = new UserController();
