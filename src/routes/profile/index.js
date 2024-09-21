'use strict';
const express = require('express');
const profileController = require('../../controllers/profile.controller');
const { grantAccess } = require('../../middlewares/rbac');
const router = express.Router();

router.get(
  '/viewAll',
  grantAccess('readAny', 'profile'),
  profileController.profiles
);

router.get(
  '/viewOne',
  grantAccess('readAny', 'profile'),
  profileController.profile
);

module.exports = router;
