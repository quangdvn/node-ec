'use strict';

const notificationModel = require('../models/notification.model');

const pushNotificationToSystem = async ({
  type = 'SHOP-001',
  receiverId = 1,
  senderId = 1,
  options = {},
}) => {
  let content;
  if (type === 'SHOP-001') {
    content = 'New product created @@@@';
  } else if (type === 'PROMOTION-001') {
    content = 'New voucher';
  }

  const newNotification = await notificationModel.create({
    type,
    senderId,
    receiverId,
    content,
    options,
  });

  return newNotification;
};

const listNotificationByUser = async ({
  userId = 1,
  type = 'ALL',
  isRead = 0,
}) => {
  const match = { receiverId: userId };
  if (type !== 'ALL') {
    match.type = type;
  }

  return await notificationModel.aggregate([
    { $match: match },
    {
      $project: {
        type: 1,
        senderId: 1,
        receiverId: 1,
        content: 1,
        options: 1,
        createdAt: 1,
        // content: {
        //   $concat: ['$content', ' ', { $toString: '$options.orderId' }],
        // },
      },
    },
    { $sort: { createdAt: -1 } },
  ]);
};

module.exports = {
  pushNotificationToSystem,
  listNotificationByUser,
};
