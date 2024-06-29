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

// Init DB
require('./databases/init.mongodb');
// require('./databases/init.mongodb.demo');
// checkOverload();

// Init routes
app.get('/', (req, res, next) => {
  const StrCompress = 'Hello World';

  return res.status(200).json({
    message: 'Hello World',
    metadata: StrCompress.repeat(100000),
  });
});

module.exports = app;
