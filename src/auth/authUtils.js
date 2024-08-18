'use strict';
const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const {
  AuthenticationFailureError,
  NotFoundError,
} = require('../core/error.response');
const KeyTokenService = require('../services/keyToken.service');
const { token } = require('morgan');

const HEADERS = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESH_TOKEN: 'x-refresh-token',
};

const createAccessTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // Create access token from private key
    // and refresh token from public key
    const accessToken = JWT.sign(payload, privateKey, {
      algorithm: 'HS256',
      expiresIn: '2 days',
    });
    const refreshToken = JWT.sign(payload, publicKey, {
      algorithm: 'HS256',
      expiresIn: '7 days',
    });
    // JWT.verify(
    //   accessToken,
    //   publicKey,
    //   { algorithms: ['RS256'] },
    //   (err, decoded) => {
    //     if (err) {
    //       console.error('Failed to verify access token: ', err.message);
    //     } else {
    //       console.log('Access Token is valid: ', decoded);
    //     }
    //   }
    // );

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

const authorizationV2 = asyncHandler(async (req, res, next) => {
  /**
   * 1 - Check userID existence ?
   * 2 - Get accessToken
   * 3 - Verify token
   * 4 - Check user data
   * 5 - Check key store
   * 6 - (Optional) Blacklist token
   * OK -> Return next()
   */
  // 1
  const userId = req.headers[HEADERS.CLIENT_ID];
  if (!userId) throw new AuthenticationFailureError('Error: Invalid request');
  
  // 2
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError('Error: Key not found');

  // 3 - Check refresh token if existed, else check access token
  if (req.headers[HEADERS.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADERS.REFRESH_TOKEN];

      // decoded = { userId, email }
      const decoded = JWT.verify(refreshToken, keyStore.publicKey);
      if (userId !== decoded.userId)
        throw new AuthenticationFailureError('Error: Invalid user');

      req.keyStore = keyStore;
      req.user = decoded;
      req.refreshToken = refreshToken;
      next();
    } catch (error) {
      throw error;
    }
  } else {
    const accessToken = req.headers[HEADERS.AUTHORIZATION];
    if (!accessToken)
      throw new AuthenticationFailureError('Error: Invalid request');

    // decoded = { userId, email }
    try {
      // decoded = { userId, email }
      const decoded = JWT.verify(accessToken, keyStore.privateKey);
      if (userId !== decoded.userId)
        throw new AuthenticationFailureError('Error: Invalid user');

      req.keyStore = keyStore;
      req.user = decoded;
      next();
    } catch (error) {
      console.log(error);
      throw new AuthenticationFailureError('Error: Invalid key');
    }
  }
});

const authorization = asyncHandler(async (req, res, next) => {
  /**
   * 1 - Check userID existence ?
   * 2 - Get accessToken
   * 3 - Verify token
   * 4 - Check user data
   * 5 - Check key store
   * 6 - (Optional) Blacklist token
   * OK -> Return next()
   */
  // 1
  const userId = req.headers[HEADERS.CLIENT_ID];
  if (!userId) throw new AuthenticationFailureError('Error: Invalid request');

  // 2
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError('Error: Key not found');

  // 3
  const accessToken = req.headers[HEADERS.AUTHORIZATION];
  if (!accessToken)
    throw new AuthenticationFailureError('Error: Invalid request');

  try {
    const decoded = JWT.verify(accessToken, keyStore.privateKey);
    if (userId !== decoded.userId)
      throw new AuthenticationFailureError('Error: Invalid user');
    req.keyStore = keyStore;
    next();
  } catch (error) {
    throw error;
  }
});

const verifyToken = async (token, secretKey) => {
  return JWT.verify(token, secretKey);
};

module.exports = {
  createAccessTokenPair,
  authorization,
  authorizationV2,
  verifyToken,
};
