'use strict';
const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const { authorizationV2 } = require('../../auth/authUtils');
const emailController = require('../../controllers/email.controller');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.post('/new/validate', asyncHandler(userController.validateNew));

module.exports = router;
