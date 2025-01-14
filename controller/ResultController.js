const Result = require('../models/Result');
const Pupil = require('../models/Pupil');
const Subject = require('../models/Subject');

// Function to calculate grade based on marks
function calculateGrade(marks) {
  if (marks >= 90) return 'A';
  if (marks >= 75) return 'B';
  if (marks >= 50) return 'C';
  if (marks >= 40) return 'D';
  return 'F';
}
exports.addResult = async (req, res) => {
  try {
    const { pupilId, subjectId, marks, academicYearId, term } = req.body;

    // Validate term input
    const validTerms = ["First Term", "Second Term", "Third Term"];
    if (!validTerms.includes(term)) {
      return res.status(400).json({ error: 'Invalid term provided' });
    }

    // Check if the pupil exists
    const pupil = await Pupil.findById(pupilId);
    if (!pupil) {
      return res.status(404).json({ error: 'Pupil not found' });
    }

    // Check if the subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Check if the pupil is assigned to this subject
    if (!pupil.subjects.includes(subjectId)) {
      return res.status(400).json({ error: 'Pupil is not assigned to this subject' });
    }

    // Check if a result already exists for this pupil, subject, academic year, and term
    const existingResult = await Result.findOne({
      pupil: pupilId,
      subject: subjectId,
      academicYear: academicYearId,
      term,
    });
    if (existingResult) {
      return res.status(400).json({ error: 'Result for this subject, academic year, and term already exists for the pupil' });
    }

    // Calculate grade
    const grade = calculateGrade(marks);

    // Create and save the result
    const result = new Result({
      pupil: pupilId,
      subject: subjectId,
      academicYear: academicYearId,
      term,
      marks,
      grade,
    });
    await result.save();

    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding result:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch all results with pagination
exports.getResults = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 25; // Default to 25 results per page
    const skip = (page - 1) * limit;

    // Fetch results with pagination
    const results = await Result.find()
      .populate('pupil')  // Populate pupil details
      .populate('subject')
      .populate('academicYear')  // Populate subject details
      .skip(skip)  // Skip the records for pagination
      .limit(limit)  // Limit the number of results per page
      .exec();

    // Get the total count of results to calculate total pages
    const totalResults = await Result.countDocuments();
    const totalPages = Math.ceil(totalResults / limit);

    res.status(200).json({
      results,
      totalResults,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getSIngleResult = async (req, res) => {
  try {
    const resultId = req.params.resultId;
    const result = await Result.findById(resultId)
      .populate('pupil', 'name') // Assuming `pupil` is a reference
      .populate('subject', 'name') // Assuming `subject` is a reference
      .populate('academicYear', 'year'); // Assuming `academicYear` is a reference

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching result:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.updateResult = async (req, res) => {
  try {
    const resultId = req.params.resultId;
    const { marks, term } = req.body;

    // Validate input
    if (marks < 0 || marks > 100) {
      return res.status(400).json({ message: 'Marks must be between 0 and 100' });
    }

    // Calculate grade based on marks
    const grade = calculateGrade(marks);

    // Update the result with the new marks and grade
    const updatedResult = await Result.findByIdAndUpdate(
      resultId,
      { marks, term, grade },
      { new: true }
    )
      .populate('pupil', 'name')
      .populate('subject', 'name')
      .populate('academicYear', 'year');

    if (!updatedResult) {
      return res.status(404).json({ message: 'Result not found' });
    }

    res.json({ message: 'Result updated successfully', result: updatedResult });
  } catch (error) {
    console.error('Error updating result:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Delete Result
exports.deleteResult = async (req, res) => {
  try {
    const resultId = req.params.id;

    // Find and delete the result
    const deletedResult = await Result.findByIdAndDelete(resultId);

    if (!deletedResult) {
      return res.status(404).json({ message: 'Result not found' });
    }

    res.status(200).json({ message: 'Result deleted successfully' });
  } catch (error) {
    console.error('Error deleting result:', error);
    res.status(500).json({ message: 'An error occurred while deleting the result' });
  }
};