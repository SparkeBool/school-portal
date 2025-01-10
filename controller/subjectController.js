const Subject = require('../models/Subject');
const Pupil = require('../models/Pupil');

// Create a new subject
const createSubject = async (req, res) => {
  try {
    const { name, teacher } = req.body;

    // Validate input
    if (!name || !teacher) {
      return res.status(400).json({ message: 'Subject Name and teacher are required.' });
    }

    // Create and save the new subject
    const subject = new Subject({ name, teacher });
    await subject.save();

    res.status(201).json({ message: 'Subject created successfully.', subject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while creating the subject.' });
  }
};

// Get all subjects
const getAllSubjects = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Pagination params

    // Fetch subjects with pagination
    const subjects = await Subject.find()
      .populate('teacher', 'name') // Populate teacher name
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Count total documents for pagination
    const totalSubjects = await Subject.countDocuments();

    res.status(200).json({
      subjects,
      totalPages: Math.ceil(totalSubjects / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


 
 

module.exports = {
  createSubject,
  getAllSubjects,
  };
