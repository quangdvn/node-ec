'use strict';
const { CreatedResponse } = require('../core/success.response');
const ProductService = require('../services/product.service');
const AdvancedProductService = require('../services/advanced/advanced.product.service');

class ProductController {
  createProduct = async (req, res, next) => {
    new CreatedResponse({
      message: 'Create Product successfully',
      metadata: await AdvancedProductService.createProduct(req.body.productType, {
        ...req.body,
        productShop: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
