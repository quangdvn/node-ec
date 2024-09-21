'use strict';
const { AuthenticationFailureError } = require('../core/error.response');
const RBACService = require('../services/rbac.service');
const rbac = require('./roles');

/**
 *
 * @param {*} action // READ, DELETE, UPDATE
 * @param {*} resource // profile, balance
 */
const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      // TODO: Save list of roles to Cache
      rbac.setGrants(await RBACService.listRoles());
      const permission = rbac.can(req.query.role)[action](resource);
      if (!permission.granted) {
        throw new AuthenticationFailureError('Error: Permission insufficient');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  grantAccess,
};
