'use strict';
const JWT = require('jsonwebtoken');

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

module.exports = { createAccessTokenPair };
