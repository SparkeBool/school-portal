const Pupil = require('../models/Pupil');
const path = require('path');
const fs = require('fs');

// Upload pupil passport
exports.uploadPassport = async (req, res) => {
  try {
    const { pupilId } = req.params;

    // Check if pupil exists
    const pupil = await Pupil.findById(pupilId);
    if (!pupil) {
      return res.status(404).json({ message: 'Pupil not found' });
    }

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Validate file size and type
    const file = req.file;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.mimetype)) {
      return res.status(400).json({ message: 'Invalid file type. Only JPG, JPEG, and PNG are allowed.' });
    }

    if (file.size > 200 * 1024) {
      return res.status(400).json({ message: 'File size exceeds 200KB.' });
    }

    // Delete the old passport if it exists
    if (pupil.passport) {
      const oldPath = path.join(__dirname, '..', 'uploads', 'passports', pupil.passport);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Update pupil record with new passport file name
    pupil.passport = file.filename;
    await pupil.save();

    res.status(200).json({ message: 'Passport uploaded successfully', pupil });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get pupil information
exports.getPupil = async (req, res) => {
  try {
    const { pupilId } = req.params;

    // Check if pupil exists
    const pupil = await Pupil.findById(pupilId).select('-password'); // Exclude password field
    if (!pupil) {
      return res.status(404).json({ message: 'Pupil not found' });
    }

    res.status(200).json({ pupil });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update pupil profile details
exports.updatePupilProfile = async (req, res) => {
  try {
    const { pupilId } = req.params;
    const { name, profile } = req.body;

    // Check if pupil exists
    const pupil = await Pupil.findById(pupilId);
    if (!pupil) {
      return res.status(404).json({ message: 'Pupil not found' });
    }

    // Update profile details
    if (name) pupil.name = name;
    if (profile) {
      pupil.profile = { ...pupil.profile, ...profile }; // Merge existing profile with updates
    }

    await pupil.save();

    res.status(200).json({ message: 'Pupil profile updated successfully', pupil });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
