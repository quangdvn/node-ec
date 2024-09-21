'use strict';

const {
  CreatedResponse,
  SuccessResponse,
} = require('../core/success.response');
const RBACService = require('../services/rbac.service');

class RBACController {
  newResource = async (req, res, next) => {
    new CreatedResponse({
      message: 'Create Resource successfully',
      metadata: await RBACService.createResource(req.body),
    }).send(res);
  };

  newRole = async (req, res, next) => {
    new CreatedResponse({
      message: 'Create Role successfully',
      metadata: await RBACService.createRole(req.body),
    }).send(res);
  };

  listRoles = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Roles successfully',
      metadata: await RBACService.listRoles(req.query),
    }).send(res);
  };

  listResources = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Resources successfully',
      metadata: await RBACService.listResources(req.query),
    }).send(res);
  };
}

module.exports = new RBACController();
