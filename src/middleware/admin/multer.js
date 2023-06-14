const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

// Define the storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads'; // Specify the destination folder for uploaded images
    fs.ensureDirSync(uploadPath); // Create the destination folder if it doesn't exist
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // Generate a unique filename
    const extension = path.extname(file.originalname); // Get the file extension
    const filename = file.fieldname + '-' + uniqueSuffix + extension;
    cb(null, filename); // Set the filename for the uploaded image
  }
});

// Define the file filter function
const fileFilter = function (req, file, cb) {
  const allowedFileTypes = ['.jpg', '.jpeg', '.png']; // Define the allowed file types
  const extension = path.extname(file.originalname).toLowerCase(); // Get the file extension

  if (allowedFileTypes.includes(extension)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, and PNG files are allowed.'), false); // Reject the file
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Set the file size limit to 5MB
  },
  fileFilter: fileFilter
});

module.exports = upload;
