const express = require('express');
const { 
  addResult, 
  getResultsForPupil, 
  updateResult, 
  deleteResult, 
  getResultsForSubject 
} = require('../controllers/ResultController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Add a new result (accessible to admin/teachers)
router.post('/add', authMiddleware(['admin', 'teacher']), addResult);

// Get all results for a pupil
router.get('/pupil/:pupilId', authMiddleware(['admin', 'teacher', 'parent']), getResultsForPupil);

// Get all results for a subject
router.get('/subject/:subjectId', authMiddleware(['admin', 'teacher']), getResultsForSubject);

// Update a result (accessible to admin/teachers)
router.put('/:resultId', authMiddleware(['admin', 'teacher']), updateResult);

// Delete a result (accessible to admin/teachers)
router.delete('/:resultId', authMiddleware(['admin', 'teacher']), deleteResult);

module.exports = router;
