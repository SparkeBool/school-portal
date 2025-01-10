const Pupil = require('../models/Pupil');
const Subject = require('../models/Subject');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Create a new pupil
exports.createPupil = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email already exists
    const existingPupil = await Pupil.findOne({ email });
    if (existingPupil) {
      return res.status(400).json({ message: 'A pupil with this email already exists.' });
    }

    if(!name || !email ) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new pupil
    const pupil = new Pupil({
      name,
      email,
      password: hashedPassword,
      });

    await pupil.save();

    res.status(201).json({ message: 'Pupil created successfully', pupil });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update existing pupil information
exports.updatePupil = async (req, res) => {
  try {
    const { email } = req.params;
    const updates = req.body; // { name, age, class, etc. }

    // Check if the pupil exists
    const pupil = await Pupil.findOne({email});
    if (!pupil) {
      return res.status(404).json({ message: 'Pupil not found' });
    }

    // Update the pupil's information
    Object.keys(updates).forEach((key) => {
      pupil[key] = updates[key];
    });

    await pupil.save();

    res.status(200).json({ message: 'Pupil updated successfully', pupil });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// View all pupils
exports.viewAllPupils = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 25; // Default to 25 pupils per page

    const skip = (page - 1) * limit;

    // Fetch the total count of pupils
    const totalPupils = await Pupil.countDocuments();

    // Fetch the pupils for the current page
    const pupils = await Pupil.find()
      .select('-password') // Exclude password field
      .skip(skip)
      .limit(limit);

    // Respond with the pupils and total count
    res.status(200).json({
      pupils,
      total: totalPupils,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// View single pupil
exports.viewSinglePupil = async (req, res) => {
  try {
    // Get pupil ID from request parameters
    const email = req.params.email;

     
    // Find pupil by ID and exclude password field
    const pupil = await Pupil.findOne({ email }).select('-password');
    
    // If pupil not found, return a 404 error
    if (!pupil) {
      return res.status(404).json({ message: 'Pupil not found' });
    }

    // Return the pupil details
    res.status(200).json({ pupil });
  } catch (err) {
    // Handle server error
    res.status(500).json({ message: err.message });
  }
};

//search pupil/api/pupils/search'
exports.SearchPupil = async (req, res) => {

  try {
   
    const name = req.query.name; // Use `name` parameter from the query string
    // console.log('Search query received:', name);
   // Check if `name` is provided and not empty
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Search query is required." });
    }

    // Search pupils by name (case-insensitive partial match)
    const results = await Pupil.find({
      name: { $regex: `.*${name}.*`, $options: 'i' },
    }).select('name rollNumber'); // Return only name and roll number

    // Check if results are empty
    if (results.length === 0) {
      return res.status(404).json({ message: "No results found." });
    }

    // Return results
    res.status(200).json({ results });
  } catch (error) {
    console.error('Error searching pupils:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Delete a pupil
exports.deletePupil = async (req, res) => {
  try {
    const { pupilId } = req.params;

    // Check if the pupil exists
    const pupil = await Pupil.findById(pupilId);
    if (!pupil) {
      return res.status(404).json({ message: 'Pupil not found' });
    }

    // Delete the pupil
    await pupil.deleteOne();

    res.status(200).json({ message: 'Pupil deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Assign subjects to a pupil
exports.assignSubject = async (req, res) => {
  try {
    const { pupilId, subjectId } = req.body; // Expect both pupilId and subjectId in the request body

    // Validate pupilId and subjectId
    if (!mongoose.Types.ObjectId.isValid(pupilId) || !mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({ message: 'Invalid pupil or subject ID.' });
    }

    // Check if the pupil exists
    const pupil = await Pupil.findById(pupilId);
    if (!pupil) {
      return res.status(404).json({ message: 'Pupil not found.' });
    }

    // Check if the subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found.' });
    }

    // Assign the subject to the pupil (avoid duplicates)
    if (!pupil.subjects.includes(subjectId)) {
      pupil.subjects.push(subjectId);
    }

    await pupil.save();

    res.status(200).json({ message: 'Subject assigned successfully.', pupil });
  } catch (err) {
    console.error('Error assigning subject:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.getAssignedPupils = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Pagination params

    // Fetch pupils with their subjects (using `populate` to fetch subject names)
    const pupils = await Pupil.find()
      .populate('subjects', 'name') // Populate only the `name` field of subjects
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Count total documents for pagination
    const totalPupils = await Pupil.countDocuments();

    res.status(200).json({
      pupils,
      totalPages: Math.ceil(totalPupils / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Error fetching assigned pupils:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.unassignSubject = async (req, res) => {
  try {
    const { pupilId } = req.body;

    // Validate pupilId
    if (!mongoose.Types.ObjectId.isValid(pupilId)) {
      return res.status(400).json({ message: 'Invalid pupil ID.' });
    }

    // Check if the pupil exists
    const pupil = await Pupil.findById(pupilId);
    if (!pupil) {
      return res.status(404).json({ message: 'Pupil not found.' });
    }

    // Unassign all subjects
    pupil.subjects = [];
    await pupil.save();

    res.status(200).json({ message: 'Subjects unassigned successfully.' });
  } catch (error) {
    console.error('Error unassigning subjects:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    // Validate subjectId
    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({ message: 'Invalid subject ID.' });
    }

    // Check if the subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found.' });
    }

    // Delete the subject
    await subject.deleteOne();

    res.status(200).json({ message: 'Subject deleted successfully.' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Fetch all academic years
exports.getAcademicYear = async (req, res) => {
  const years = await AcademicYear.find();
  res.json(years);
};

// Add a new academic year
exports.addAcademicYear = async (req, res) => {
  const { year } = req.body;
  const newYear = new AcademicYear({ year });
  await newYear.save();
  res.json(newYear);
};