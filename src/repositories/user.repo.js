'use strict';

const userModel = require('../models/user.model');

const createNewUser = async ({ name, email, slug, password, role }) => {
  const user = await userModel.create({
    name,
    email,
    slug,
    password,
    role,
  });
  return user;
};

module.exports = {
  createNewUser,
};
