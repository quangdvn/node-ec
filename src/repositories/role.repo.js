'use strict';

const roleModel = require('../models/role.model');

const getSystemRole = async ({ roleName }) => {
  const role = await roleModel.findOne({
    name: roleName,
  });
  return role;
};

module.exports = {
  getSystemRole,
};
