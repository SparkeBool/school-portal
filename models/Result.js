const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  pupil: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pupil',
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  academicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'academicYear',
    required: true,
  },
  term: {
    type: String, // Example: "First Term", "Second Term", "Third Term"
    required: true,
    enum: ["First Term", "Second Term", "Third Term"], // Limit to valid options
  },
  marks: {
    type: Number,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Result', ResultSchema);
