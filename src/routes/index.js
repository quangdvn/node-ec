'use strict';
const express = require('express');
const { apiKeyCheck, permissionCheck } = require('../auth/authMiddleware');
const { pushToDiscord } = require('../middlewares/discord');
const router = express.Router();

router.get('/v1/api/health-check', (req, res) => {
  res.status(200).json({ message: 'Healthy' });
});

// Check API Key - Will be used by BFF server
// router.use(apiKeyCheck);
// Check permission
// router.use(permissionCheck('0000'));
router.use(pushToDiscord);
// Checkout without login
router.use('/v1/api/email', require('./email/index'));
router.use('/v1/api/user', require('./user/index'));
router.use('/v1/api/checkout', require('./checkout/index'));
router.use('/v1/api/rbac', require('./rbac/index'));
router.use('/v1/api/profile', require('./profile/index'));
router.use('/v1/api/discount', require('./discount/index'));
router.use('/v1/api/inventory', require('./inventory/index'));
router.use('/v1/api/cart', require('./cart/index'));
router.use('/v1/api/product', require('./product/index'));
router.use('/v1/api/notification', require('./notification/index'));
router.use('/v1/api/comment', require('./comment/index'));
router.use('/v1/api/upload', require('./upload/index'));
router.use('/v1/api', require('./access/index'));

module.exports = router;
