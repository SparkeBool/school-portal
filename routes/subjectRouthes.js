// const express = require('express');
// const {
//   createSubject,
//   getAllSubjects,
//   getSubjectById,
//   updateSubject,
//   addPupilToSubject,
//   removePupilFromSubject,
//   deleteSubject,
// } = require('../controllers/SubjectController');
// const authMiddleware = require('../middleware/authMiddleware');

// const router = express.Router();

// // Routes for managing subjects
// router.post('/create-subject', authMiddleware(['admin']), createSubject);
// router.get('/subjects', authMiddleware(['admin', 'pupil']), getAllSubjects);
// // router.get('/:id', authMiddleware(['admin', 'pupil']), getSubjectById);
// router.put('/:id', authMiddleware(['admin']), updateSubject);
// router.post('/add-pupil', authMiddleware(['admin']), addPupilToSubject);
// router.post('/remove-pupil', authMiddleware(['admin']), removePupilFromSubject);
// router.delete('/:id', authMiddleware(['admin']), deleteSubject);

// module.exports = router;
