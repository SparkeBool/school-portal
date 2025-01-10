const Result = require('../models/Result');
const Pupil = require('../models/Pupil');
const Subject = require('../models/Subject');

// Add a new result
exports.addResult = async (req, res) => {
  try {
    const { pupilId, subjectId, marks, grade } = req.body;

    // Validate pupil and subject existence
    const pupil = await Pupil.findById(pupilId);
    if (!pupil) return res.status(404).json({ message: 'Pupil not found' });

    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const result = new Result({ pupil: pupilId, subject: subjectId, marks, grade });
    await result.save();

    res.status(201).json({ message: 'Result added successfully', result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all results for a pupil
exports.getResultsForPupil = async (req, res) => {
  try {
    const { pupilId } = req.params;

    // Validate pupil existence
    const pupil = await Pupil.findById(pupilId);
    if (!pupil) return res.status(404).json({ message: 'Pupil not found' });

    const results = await Result.find({ pupil: pupilId }).populate('subject', 'name');
    res.status(200).json({ results });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a result
exports.updateResult = async (req, res) => {
  try {
    const { resultId } = req.params;
    const { marks, grade } = req.body;

    const result = await Result.findByIdAndUpdate(
      resultId,
      { marks, grade },
      { new: true, runValidators: true }
    );
    if (!result) return res.status(404).json({ message: 'Result not found' });

    res.status(200).json({ message: 'Result updated successfully', result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a result
exports.deleteResult = async (req, res) => {
  try {
    const { resultId } = req.params;

    const result = await Result.findByIdAndDelete(resultId);
    if (!result) return res.status(404).json({ message: 'Result not found' });

    res.status(200).json({ message: 'Result deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all results for a specific subject
exports.getResultsForSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    // Validate subject existence
    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const results = await Result.find({ subject: subjectId }).populate('pupil', 'name');
    res.status(200).json({ results });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
