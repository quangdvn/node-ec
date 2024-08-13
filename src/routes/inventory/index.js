'use strict';
const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const { authorizationV2 } = require('../../auth/authUtils');
const inventoryController = require('../../controllers/inventory.controller');
const router = express.Router();

router.use(authorizationV2);
router.post('/post', asyncHandler(inventoryController.addStock));

module.exports = router;
