'use strict';
const { ReasonPhrases, StatusCodes } = require('./httpStatusCode');
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.now = Date.now();

    // TODO: Define a common pattern for log params
    // Log error with winston
    // logger.error(this.message, {
    //   context: '/path',
    //   requestId: 'UUIDDDDD',
    //   message: this.message,
    //   metadata: {},
    // });
    // logger.error(this.message, [
    //   '/api/v1/login',
    //   {
    //     body: 'Hello',
    //     requestId: 'UUIDDDDD',
    //   },
    //   { error: 'Bad Request' },
    //   { ping: 'pong' },
    // ]);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.BAD_REQUEST,
    statusCode = StatusCodes.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    statusCode = StatusCodes.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.CONFLICT,
    statusCode = StatusCodes.CONFLICT
  ) {
    super(message, statusCode);
  }
}

class AuthenticationFailureError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    statusCode = StatusCodes.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.FORBIDDEN,
    statusCode = StatusCodes.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  BadRequestError,
  NotFoundError,
  ConflictRequestError,
  AuthenticationFailureError,
  ForbiddenError,
};
