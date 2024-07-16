'use strict';
const {
  CreatedResponse,
  SuccessResponse,
} = require('../core/success.response');
// const ProductService = require('../services/product.service');
const AdvancedProductService = require('../services/advanced/advanced.product.service');

class ProductController {
  createProduct = async (req, res, next) => {
    new CreatedResponse({
      message: 'Create Product successfully',
      metadata: await AdvancedProductService.createProduct(
        req.body.productType,
        {
          ...req.body,
          productShop: req.user.userId,
        }
      ),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Publish product successfully',
      metadata: await AdvancedProductService.publishProductByShop({
        shopId: req.user.userId,
        productId: req.params.id,
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Publish product successfully',
      metadata: await AdvancedProductService.unPublishProductByShop({
        shopId: req.user.userId,
        productId: req.params.id,
      }),
    }).send(res);
  };

  /**
   * @desc
   * @param {*} req
   * @param {*} res
   * @param {*} next
   *
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list of draft products successfully',
      metadata: await AdvancedProductService.getAllDraftsForShop({
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list of publish products successfully',
      metadata: await AdvancedProductService.getAllPublishForShop({
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  searchProductsByUser = async (req, res, next) => {
    new SuccessResponse({
      message: 'Search products successfully',
      metadata: await AdvancedProductService.searchProductsByUser(req.params),
    }).send(res);
  };
}

module.exports = new ProductController();
