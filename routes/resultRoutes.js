const express = require('express');
const { 
  addResult, 
  getResultsForPupil, 
  updateResult, 
  deleteResult, 
  getResultsForSubject, 
  getResults,
  getSIngleResult
} = require('../controller/ResultController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Add a new result (accessible to admin/teachers)
router.post('/add-results', authMiddleware(['admin']), addResult);

// // Get all results for a subject
router.get('/all-results', authMiddleware(['admin']), getResults);

// // Get all results for a pupil
router.get('/:resultId', authMiddleware(['admin']), getSIngleResult);
router.delete('/delete-result/:id', authMiddleware(['admin']), deleteResult);


//update result
router.put('/update/:resultId', authMiddleware(['admin']), updateResult);



// // Update a result (accessible to admin/teachers)
// router.put('/:resultId', authMiddleware(['admin', 'teacher']), updateResult);

// // Delete a result (accessible to admin/teachers)
// router.delete('/:resultId', authMiddleware(['admin', 'teacher']), deleteResult);

module.exports = router;
