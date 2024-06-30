'use strict';
const express = require('express');
const { apiKeyCheck, permissionCheck } = require('../auth/authMiddleware');
const router = express.Router();

// Check API Key
// router.use(apiKeyCheck);
// Check permission
// router.use(permissionCheck('0000'));

router.use('/v1/api', require('./access/index'));

module.exports = router;
