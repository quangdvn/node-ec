'use strict';
const cloudinary = require('../configs/cloudinary.config.js');

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
    console.error(error);
  }
};

module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
};
