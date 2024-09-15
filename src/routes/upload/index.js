'use strict';
const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const uploadController = require('../../controllers/upload.controller');
const { uploadDisk } = require('../../configs/multer.config');
const router = express.Router();

router.post('/product/', asyncHandler(uploadController.uploadFile));
router.post(
  '/product/thumb',
  uploadDisk.single('file'),
  asyncHandler(uploadController.uploadThumbnail)
);

module.exports = router;
