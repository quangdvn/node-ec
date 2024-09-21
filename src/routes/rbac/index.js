'use strict';
const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const RBACController = require('../../controllers/rbac.controller');
const router = express.Router();

router.post('/role', asyncHandler(RBACController.newRole));
router.get('/roles', asyncHandler(RBACController.listRoles));

router.post('/resource', asyncHandler(RBACController.newResource));
router.get('/resources', asyncHandler(RBACController.listResources));

module.exports = router;
