'use strict';

const DiscordLogger = require('../loggers/discord.log');

const pushToDiscord = async (req, res, next) => {
  try {
    DiscordLogger.sendToFormatCode({
      title: `Method: ${req.method}`,
      code: req.method === 'GET' ? req.query : req.body,
      message: `${req.get('host')}${req.originalUrl}`,
    });

    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  pushToDiscord,
};
