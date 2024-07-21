'use strict';
const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const productController = require('../../controllers/product.controller');
const { authorizationV2 } = require('../../auth/authUtils');
const discountController = require('../../controllers/discount.controller');
const router = express.Router();

router.post('/amount', asyncHandler(discountController.applyDiscountCode));
router.get(
  '/list_product_code',
  asyncHandler(discountController.getAllProductsByDiscountCode)
);

router.use(authorizationV2);

router.get('/', asyncHandler(discountController.getAllDiscountCodesByShop));
router.post('/', asyncHandler(discountController.createDiscountCode));

module.exports = router;
