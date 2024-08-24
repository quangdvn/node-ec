'use strict';
const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
// const { authorizationV2 } = require('../../auth/authUtils');
const notificationController = require('../../controllers/notification.controller');
const router = express.Router();

router.get('/', asyncHandler(notificationController.getAllNotificationByUser));

module.exports = router;
