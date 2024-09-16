'use strict';
const multer = require('multer');

// When you use a Node.js server to upload files to Cloudinary, you typically need a multer middleware to handle the file parsing
// from an incoming multipart/form-data request before sending the file to Cloudinary. Here's why:

// 	1.	Handling multipart/form-data: File uploads are usually sent as multipart/form-data, which is a special encoding type that enables sending files along with text fields.
//      multer is a middleware designed to process this type of form data.
//      It extracts the files and other data from the request, making it easier for your server to process them.
// 	2.	Converting the file into a manageable format: Before uploading the file to Cloudinary, it must be in a format that your server can manipulate.
//      multer saves the file temporarily on your server (or keeps it in memory), so you can access and pass it to Cloudinary.
// 	3.	Accessing the file: After multer processes the incoming request, it attaches the file(s) to req.file or req.files,
//      depending on whether you're handling a single file or multiple files. From there, you can pass it to Cloudinary's API for uploading.

// Without multer, your server wouldn't be able to properly parse and handle the incoming file data, making it challenging to upload files to Cloudinary or
// any other storage service.

// In summary, multer simplifies the task of handling file uploads by parsing and managing the files before you send them to Cloudinary.

const uploadMemory = multer({
  storage: multer.memoryStorage(),
});

const uploadDisk = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

module.exports = {
  uploadMemory,
  uploadDisk,
};
