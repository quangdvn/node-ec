'use strict';

const CODE = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
};

const REASON = {
  OK: 'Success',
  CREATED: 'Created',
  ACCEPTED: 'Accepted',
  NO_CONTENT: 'No Content',
};

class NormalResponse {
  constructor({
    message,
    statusCode = CODE.OK,
    reason = REASON.OK,
    metadata = {},
    options = {},
  }) {
    this.status = statusCode;
    this.message = !message ? reason : message;
    this.metadata = metadata;
    this.options = options;
  }

  send(res, headers = {}) {
    res.set({ ...headers });
    return res.status(this.status).json(this);
  }
}

class SuccessResponse extends NormalResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CreatedResponse extends NormalResponse {
  constructor({ message, metadata }) {
    super({
      message,
      statusCode: CODE.CREATED,
      reason: REASON.CREATED,
      metadata,
    });
  }
}

module.exports = {
  SuccessResponse,
  CreatedResponse,
};
