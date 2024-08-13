'use strict';
const { SuccessResponse } = require('../core/success.response');
const InventoryService = require('../services/inventory.service');

class InventoryController {
  addStock = async (req, res, next) => {
    new SuccessResponse({
      message: 'Done check out',
      metadata: await InventoryService.addStockToInventory(req.body),
    }).send(res);
  };
}

module.exports = new InventoryController();
