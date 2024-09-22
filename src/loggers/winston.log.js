'use strict';
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  // level: 'info',
  // format: format.combine(
  //   format.colorize(),
  //   format.timestamp(),
  //   format.printf(
  //     ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
  //   )
  // ),
  // transports: [
  //   new transports.Console(),
  //   new transports.File({ filename: 'app.log' }),
  // ],
  level: process.env.LOG_LEVEL || 'debug',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD hh:mm:ss A',
    }),
    format.align(),
    format.colorize(),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}:${message}`
    )
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      dirname: 'logs',
      filename: 'test.log',
    }),
  ],
});

logger

module.exports = logger;
