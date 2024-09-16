'use strict';
const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const uploadController = require('../../controllers/upload.controller');
const { uploadDisk, uploadMemory } = require('../../configs/multer.config');
const router = express.Router();

// Cloudinary
router.post('/product/', asyncHandler(uploadController.uploadFile));
router.post(
  '/product/thumb',
  uploadDisk.single('file'),
  asyncHandler(uploadController.uploadThumbnail)
);
router.post(
  '/product/multiple',
  uploadDisk.array('files', 3),
  asyncHandler(uploadController.uploadMultipleThumbnail)
);

// S3
router.post(
  '/product/bucket',
  uploadMemory.single('file'),
  asyncHandler(uploadController.uploadLocalFileS3)
);

module.exports = router;
