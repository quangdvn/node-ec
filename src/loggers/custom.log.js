'use strict';
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const { v4: uuidv4 } = require('uuid');

/**
 * Error
 * Warning
 * Debug
 * Info
 * RequestId || TraceId
 */

class MyLogger {
  constructor() {
    const formatPrint = format.printf(
      ({ level, message, context, requestId, metadata, timestamp }) => {
        return `${timestamp}:::${level}:::${context}:::${requestId}:::${message}:::${JSON.stringify(
          metadata
        )}`;
      }
    );

    this.logger = createLogger({
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD hh:mm:ss A',
        }),
        formatPrint
      ),
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), formatPrint),
        }),
        new transports.DailyRotateFile({
          dirname: 'logs',
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true, // Zip files before get deleted
          maxSize: '1m', // Generate new file when exceeding
          maxFiles: '14d',
          format: format.combine(
            format.timestamp({
              format: 'YYYY-MM-DD hh:mm:ss A',
            }),
            formatPrint
          ),
          level: 'info',
        }),
        new transports.DailyRotateFile({
          dirname: 'logs',
          filename: 'application-%DATE%.error.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true, // Zip files before get deleted
          maxSize: '1m', // Generate new file when exceeding
          maxFiles: '14d',
          format: format.combine(
            format.timestamp({
              format: 'YYYY-MM-DD hh:mm:ss A',
            }),
            formatPrint
          ),
          level: 'error',
          silent: false,
        }),
      ],
    });
  }

  normalizeParams(params) {
    let context, req, metadata;
    if (!Array.isArray(params)) {
      context = params.context;
      req = params.req;
      metadata = params.metadata;
    } else {
      [context, req, metadata] = params;
    }
    const requestId = req?.requestId || uuidv4();

    return { requestId, context, metadata };
  }

  log(message, params) {
    const normalizedParams = this.normalizeParams(params);
    const logObject = Object.assign({ message }, normalizedParams);
    this.logger.info(logObject);
  }

  error(message, params) {
    const normalizedParams = this.normalizeParams(params);
    const logObject = Object.assign({ message }, normalizedParams);
    this.logger.error(logObject);
  }
}

module.exports = new MyLogger();
