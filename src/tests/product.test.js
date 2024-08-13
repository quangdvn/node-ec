const PubSubService = require('../services/pubsub.service');

class ProductServiceTest {
  purchaseProduct(productId, quantity) {
    // Logic to purchase a product
    console.log(`Purchasing product ${productId} with quantity ${quantity}`);

    const order = {
      productId,
      quantity,
    };
    PubSubService.publish('purchase_events', order);
  }
}

module.exports = new ProductServiceTest();
