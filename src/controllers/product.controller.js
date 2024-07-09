'use strict';
const { CreatedResponse } = require('../core/success.response');
const ProductService = require('../services/product.service');

class ProductController {
  createProduct = async (req, res, next) => {
    new CreatedResponse({
      message: 'Create Product successfully',
      metadata: await ProductService.createProduct(
        req.body.productType,
        req.body
      ),
    }).send(res);
  };
}

module.exports = new ProductController();
