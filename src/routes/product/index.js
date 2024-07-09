'use strict';
const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const productController = require('../../controllers/product.controller');
const router = express.Router();

router.post('/', asyncHandler(productController.createProduct));

module.exports = router;
