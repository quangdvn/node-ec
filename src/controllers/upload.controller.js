'use strict';
const {
  CreatedResponse,
  SuccessResponse,
} = require('../core/success.response');
const { BadRequestError } = require('../core/error.response');
const {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadMultiImagesFromLocal,
  uploadImageFromLocalToS3,
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
    // fieldname: 'file',
    // originalname: 'test.png',
    // encoding: '7bit',
    // mimetype: 'image/png',
    // destination: './src/uploads/',
    // filename: '1726368696550-test.png',
    // path: 'src/uploads/1726368696550-test.png',
    // size: 660837
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

  async uploadMultipleThumbnail(req, res, next) {
    const { files } = req;
    if (!files.length) {
      throw new BadRequestError('Please upload file');
    }
    return new SuccessResponse({
      message: 'Upload files successfully',
      metadata: await uploadMultiImagesFromLocal({
        files,
      }),
    }).send(res);
  }

  async uploadLocalFileS3(req, res, next) {
    const { file } = req;
    // fieldname: 'file',
    // originalname: 'test.png',
    // encoding: '7bit',
    // mimetype: 'image/png',
    // buffer: <Buffer>
    // size: 660837
    if (!file) {
      throw new BadRequestError('Please upload file');
    }
    return new SuccessResponse({
      message: 'Upload file successfully',
      metadata: await uploadImageFromLocalToS3({ file }),
    }).send(res);
  }
}

module.exports = new UploadController();
