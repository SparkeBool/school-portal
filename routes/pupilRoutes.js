const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { uploadPassport, getPupil, updatePupilProfile } = require('../controller/PupilController');

const router = express.Router();

// Route: Upload pupil passport
router.post('/:pupilId/upload-passport', authMiddleware(['admin', 'pupil']), upload.single('passport'), uploadPassport);

// Route: Get pupil information
router.get('/:pupilId', authMiddleware(['admin', 'pupil']), getPupil
);

// Route: Update pupil profile
router.put('/:pupilId', authMiddleware(['admin', 'pupil']), updatePupilProfile);

module.exports = router;
