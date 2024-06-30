'use strict';

const { findById } = require('../services/apiKey.service');

const HEADERS = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};

const apiKeyCheck = async (req, res, next) => {
  try {
    const key = req.headers[HEADERS['API_KEY']]?.toString();
    if (!key) {
      return res.status(403).json({
        message: 'Forbidden Error: Missing API Key',
      });
    }
    // Check existing key
    const keyObject = await findById(key);
    if (!keyObject) {
      return res.status(403).json({
        message: 'Forbidden Error: Invalid API Key',
      });
    }
    req.apiKey = keyObject;

    return next();
  } catch (err) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
};

const permissionCheck = (permission) => {
  return (req, res, next) => {
    if (!req.apiKey.permissions) {
      return res.status(403).json({
        message: 'Forbidden Error: Permisson Denided',
      });
    }
    // console.log('This is apiKey', req.apiKey);
    if (!req.apiKey.permissions.includes(permission)) {
      return res.status(403).json({
        message: 'Forbidden Error: Insufficient permissions',
      });
    }
    return next();
  };
};

// const asyncHandler = (fn) => {
//   return (req, res, next) => {
//     return fn(req, res, next).catch((err) => {
//       next(err);
//     });
//   };
// };

// simplify the error handling process in asynchronous code.
// Instead of having to wrap each asynchronous function call in a
// try-catch
// block, you can use the
// asyncHandler
// to handle the error propagation for you
const asyncHandler = (fn) => (req, res, next) => fn(req, res, next).catch(next);

module.exports = {
  apiKeyCheck,
  permissionCheck,
  asyncHandler,
};
