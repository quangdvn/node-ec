require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
const { checkOverload } = require('./helpers/checkConn');
const app = express();

// Init Middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Init DB
require('./databases/init.mongodb');
// require('./databases/init.mongodb.demo');
// checkOverload();

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
  // Add additional error details in development mode
  if (process.env.ENV === 'dev') {
    errorResponse.stack = err.stack;
  }
  // Send the error response
  return res.status(statusCode).json(errorResponse);
});

module.exports = app;
