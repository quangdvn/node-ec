'use strict';
const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const productController = require('../../controllers/product.controller');
const { authorizationV2 } = require('../../auth/authUtils');
const router = express.Router();

router.get(
  '/search/:searchKey',
  asyncHandler(productController.searchProductsByUser)
);
router.get('/sku/variation', asyncHandler(productController.findOneSku));
router.get('/spu/info', asyncHandler(productController.findOneSpu));

router.get('/', asyncHandler(productController.findAllProducts));
router.get('/:productId', asyncHandler(productController.findProduct));

// Middleware
router.use(authorizationV2);

// ================== SPU / SKU ==================
router.post('/spu/new', asyncHandler(productController.createSpu));
// ================== SPU / SKU ==================

router.post('/', asyncHandler(productController.createProduct));
router.patch('/:productId', asyncHandler(productController.updateProduct));

router.post(
  '/publish/:id',
  asyncHandler(productController.publishProductByShop)
);
router.post(
  '/unpublish/:id',
  asyncHandler(productController.unPublishProductByShop)
);

router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop));
router.get(
  '/publish/all',
  asyncHandler(productController.getAllPublishForShop)
);

module.exports = router;
