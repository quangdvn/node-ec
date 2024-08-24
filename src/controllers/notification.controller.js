'use strict';
const { SuccessResponse } = require('../core/success.response');
const { listNotificationByUser } = require('../services/notification.service');

class NotificationController {
  getAllNotificationByUser = async (req, res, next) => {
    new SuccessResponse({
      message: 'Done check out',
      metadata: await listNotificationByUser(req.query),
    }).send(res);
  };
}

module.exports = new NotificationController();
