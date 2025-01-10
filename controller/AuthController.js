const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Pupil = require('../models/Pupil');

// Register Controller
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if a user with the given email already exists in either Admin or Pupil collections
    const existingAdmin = await Admin.findOne({ email });
    const existingPupil = await Pupil.findOne({ email });

    if (existingAdmin || existingPupil) {
      return res.status(400).json({ message: 'User already exists. Please log in instead.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if no admin exists in the database (Admin.countDocuments() returns 0)
    const isAdmin = (await Admin.countDocuments()) === 0;

    if (isAdmin) {
      // Register the first user as admin
      const admin = new Admin({ email, password: hashedPassword });
      await admin.save();
      return res.status(201).json({ message: 'Admin registered successfully. You can now log in.' });
    } else {
      // Register subsequent users as pupils
      const pupil = new Pupil({ email, password: hashedPassword });
      await pupil.save();
      return res.status(201).json({ message: 'Pupil registered successfully. You can now log in.' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'An error occurred during registration.' });
  }
};


// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists in either Admin or Pupil collections
    const admin = await Admin.findOne({ email });
    const pupil = await Pupil.findOne({ email });
    const user = admin || pupil;

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const role = admin ? 'admin' : 'pupil';
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    if (role === 'admin') {
      return res.status(200).json({ message: 'Login successful. Redirecting to admin page.', role });
    } else {
      return res.status(200).json({ message: 'Login successful. Redirecting to pupil page.', role });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Logout Controller
exports.logout = (req, res) => {
  try {
    // Clear the cookie containing the token
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return res.status(200).json({ message: 'Logout successful... Redirecting to login page' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
