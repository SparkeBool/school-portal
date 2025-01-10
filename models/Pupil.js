const mongoose = require('mongoose');

const PupilSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  rollNumber: {
    type: String,
    trim: true,
    default:"Not Assigned"
  },
  age: {
    type: Number,
    min: 1, // Minimum age validation
  },
  class: {
    type: String,
       trim: true,
       default: "Not Assigned"
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (email) {
        // Regex to validate email format
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Please enter a valid email address.',
    },
  },
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin', // or 'Parent' if you add a Parent model
  },
  passport: {
    type: String, // Path to the uploaded image file
    default: null,
  },
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject', // Reference to associated subjects
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Pupil', PupilSchema);
