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
