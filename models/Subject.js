const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  teacher: {
    type: String,
    required: true,
    trim: true,
  },
  pupils: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pupil',
  }],
}, { timestamps: true });

module.exports = mongoose.model('Subject', SubjectSchema);
