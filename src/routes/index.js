'use strict';
const express = require('express');
const { apiKeyCheck, permissionCheck } = require('../auth/authMiddleware');
const router = express.Router();

// Check API Key
// router.use(apiKeyCheck);
// Check permission
// router.use(permissionCheck('0000'));

router.use('/v1/api/discount', require('./discount/index'));
router.use('/v1/api/product', require('./product/index'));
router.use('/v1/api', require('./access/index'));

module.exports = router;
