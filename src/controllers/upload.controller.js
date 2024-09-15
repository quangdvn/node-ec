'use strict';
const {
  CreatedResponse,
  SuccessResponse,
} = require('../core/success.response');
const { BadRequestError } = require('../core/error.response');
const {
  uploadImageFromUrl,
  uploadImageFromLocal,
} = require('../services/upload.service');

class UploadController {
  async uploadFile(req, res, next) {
    return new SuccessResponse({
      message: 'Upload file successfully',
      metadata: await uploadImageFromUrl(),
    }).send(res);
  }

  async uploadThumbnail(req, res, next) {
    const { file } = req;
    console.log('123', file);
    if (!file) {
      throw new BadRequestError('Please upload file');
    }
    return new SuccessResponse({
      message: 'Upload file successfully',
      metadata: await uploadImageFromLocal({
        path: file.path,
      }),
    }).send(res);
  }
}

module.exports = new UploadController();
