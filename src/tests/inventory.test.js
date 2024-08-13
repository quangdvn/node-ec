const PubSubService = require('../services/pubsub.service');

class InventoryServiceTest {
  constructor() {
    PubSubService.subscribe('purchase_events', (channel, message) => {
      console.log(`Subcribed on ${channel}`);
      InventoryServiceTest.updateInventory(message);
    });
  }

  static updateInventory(message) {
    console.log(
      `Update inventory ${message.productId} with quantity ${message.quantity}`
    );
  }
}

module.exports = new InventoryServiceTest();
