'use strict';
const { getSignedUrl } = require('@aws-sdk/cloudfront-signer');
const cloudinary = require('../configs/cloudinary.config.js');
const fs = require('fs');
const path = require('path');
const {
  PutObjectCommand,
  GetObjectCommand,
  S3,
} = require('../configs/s3.config.js');
// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { BadRequestError } = require('../core/error.response.js');

// 1. Upload from image url
const uploadImageFromUrl = async () => {
  try {
    const imageUrl =
      'https://down-vn.img.susercontent.com/file/vn-11134258-7r98o-lzaftuvajadp29';
    const folderName = 'product/456789',
      newFilename = 'test';

    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: folderName,
      public_id: newFilename,
    });
    return result;
  } catch (error) {
    console.error(error);
  }
};

// 2. Upload from local
const uploadImageFromLocal = async ({ path, folder = 'product/123456789' }) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      folder: folder,
      public_id: 'thumb',
    });
    return {
      imageUrl: result.secure_url,
      thumbUrl: cloudinary.url(result.public_id, {
        height: 100,
        width: 100,
        format: 'jpg',
        secure: true,
      }),
      shopId: 5409,
    };
  } catch (error) {
    console.error('Upload error: ', error);
  }
};

// Upload multiple file from local with multer
const uploadMultiImagesFromLocal = async ({
  files,
  folder = 'product/multi',
}) => {
  try {
    console.log(`Files::`, files);
    if (!files.length) return;
    const uploadUrls = [];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder,
      });
      uploadUrls.push({
        imageUrl: result.secure_url,
        thumbUrl: cloudinary.url(result.public_id, {
          height: 100,
          width: 100,
          format: 'jpg',
          secure: true,
        }),
        shopId: 5409,
      });
    }

    return uploadUrls;
  } catch (error) {
    console.error('Upload multifiles error: ', error);
  }
};

// ========================= UPLOAD WITH S3 =========================
const uploadImageFromLocalToS3 = async ({ file }) => {
  try {
    const imageName = `${Date.now()}_${file.originalname}`;
    const putCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName || `${Date.now()}_default`,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    const result = await S3.send(putCommand);

    // Export presigned-url for S3 file public access
    // const getCommand = new GetObjectCommand({
    //   Bucket: process.env.AWS_BUCKET_NAME,
    //   Key: imageName,
    // });
    // const url = await getSignedUrl(S3, getCommand, { expiresIn: 3600 }); - S3 signed URL

    // Cloudfront signed URL

    const privateKey = fs.readFileSync(
      path.resolve(__dirname, '../keys/private_key.pem'),
      'utf8'
    );
    console.log(privateKey);
    console.log(process.env.AWS_CLOUDFRONT_KEYPAIR_ID);

    const signedUrl = getSignedUrl({
      url: `${process.env.AWS_CLOUDFRONT_DOMAIN}/${imageName}`,
      dateLessThan: new Date(Date.now() + 1000 * 60), // 1 minute,
      keyPairId: process.env.AWS_CLOUDFRONT_KEYPAIR_ID,
      privateKey: privateKey,
    });

    return {
      url: signedUrl,
      result,
    };
  } catch (error) {
    console.error('Upload error with S3: ', error);
    throw new BadRequestError('Error: Unable to upload');
  }
};

module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadMultiImagesFromLocal,
  uploadImageFromLocalToS3,
};
