'use strict';
const express = require('express');
const accessController = require('../../controllers/access.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authorizationV2 } = require('../../auth/authUtils');
const router = express.Router();

router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));

// Middleware
router.use(authorizationV2);

router.post('/shop/logout', asyncHandler(accessController.logout));

router.post(
  '/shop/refresh_token',
  asyncHandler(accessController.handleRefreshToken)
);

module.exports = router;
