require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
const { checkOverload } = require('./helpers/checkConn');
// const pubsubService = require('./services/pubsub.service');
const { v4: uuidv4 } = require('uuid');
const customLogger = require('./loggers/custom.log');
const app = express();

// Init Middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'];
  req.requestId = requestId ? requestId : uuidv4();
  customLogger.log(`Request sent:::${req.method}`, [
    req.path,
    { requestId: req.requestId },
    req.method === 'GET' ? req.query : req.body,
  ]);
  next();
});

// Test pub-sub
// require('./tests/inventory.test');
// const productTest = require('./tests/product.test');
// productTest.purchaseProduct('product:001', 10);

// Init DB
require('./databases/mongodb.init');
// initRedis();
// require('./databases/init.mongodb.demo');
// checkOverload();

// Init Redis
const { initIORedis } = require('./databases/ioredis.init');
initIORedis({
  IOREDIS_IS_ENABLED: process.env.IOREDIS_IS_ENABLED,
  IOREDIS_HOST: process.env.IOREDIS_HOST,
});

// Init routes
app.use('/', require('./routes/index'));

// Handle common errors
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  errorResponse = {
    status: 'error',
    code: statusCode,
    message: err.message || 'Internal Server Error',
  };

  const logMessage = `${statusCode}:::${
    Date.now() - err.now
  }ms:::Response: ${JSON.stringify(errorResponse)}`;
  customLogger.error(logMessage, [
    req.path,
    { requestId: req.requestId },
    {
      message: errorResponse.message,
    },
  ]);

  // Add additional error details in development mode
  if (process.env.ENV === 'dev') {
    errorResponse.stack = err.stack;
  }
  // Send the error response
  return res.status(statusCode).json(errorResponse);
});

module.exports = app;
