const multer = require('multer');
const path = require('path');

// Define the storage location and file naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'passports')); // Store in 'uploads/passports'
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Create a unique file name
  },
});

// File filter for validation
const fileFilter = (req, file, cb) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (validTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed.'));
  }
};

// Multer configuration with storage and file size limit
const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 }, // 200KB size limit
  fileFilter,
});

module.exports = upload;
