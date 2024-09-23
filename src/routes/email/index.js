'use strict';
const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const { authorizationV2 } = require('../../auth/authUtils');
const emailController = require('../../controllers/email.controller');

const router = express.Router();

router.post('/template/new', asyncHandler(emailController.newTemplate));

module.exports = router;
