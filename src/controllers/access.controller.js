'use strict';
const {
  CreatedResponse,
  SuccessResponse,
} = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
  login = async (req, res, next) => {
    new SuccessResponse({
      message: 'Login successfully',
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new CreatedResponse({
      message: 'Register successfully',
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new CreatedResponse({
      message: 'Logout successfully',
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  handleRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: 'Refresh token successfully',
      metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
    }).send(res);
  };
}

module.exports = new AccessController();
