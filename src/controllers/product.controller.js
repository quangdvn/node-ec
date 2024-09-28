'use strict';
const {
  CreatedResponse,
  SuccessResponse,
} = require('../core/success.response');
// const ProductService = require('../services/product.service');
const AdvancedProductService = require('../services/advanced/advanced.product.service');
const SkuService = require('../services/sku.service');
const SpuService = require('../services/spu.service');

class ProductController {
  // ================== SPU / SKU ==================
  createSpu = async (req, res, next) => {
    new CreatedResponse({
      message: 'Create new SPU successfully',
      metadata: await SpuService.newSpu({
        ...req.body,
        productShop: req.user.userId,
      }),
    }).send(res);
  };

  findOneSpu = async (req, res, next) => {
    const { spuId } = req.query;
    new SuccessResponse({
      message: 'Get SPU successfully',
      metadata: await SpuService.oneSpu({ spuId }),
    }).send(res);
  };

  findOneSku = async (req, res, next) => {
    const { skuId, spuId } = req.query;
    new SuccessResponse({
      message: 'Get SKU successfully',
      metadata: await SkuService.oneSku({ skuId, spuId }),
    }).send(res);
  };
  // ================== SPU / SKU ==================

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

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Product successfully',
      metadata: await AdvancedProductService.updateProduct(
        req.body.productType,
        req.params.productId,
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

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Find all products successfully',
      metadata: await AdvancedProductService.findAllProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Find product successfully',
      metadata: await AdvancedProductService.findProduct({
        productId: req.params.productId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
