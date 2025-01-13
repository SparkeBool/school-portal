const express = require('express');
const { createPupil, 
        viewAllPupils, 
        deletePupil, 
        assignSubject, 
        viewSinglePupil, 
        updatePupil, 
        SearchPupil, 
        getAssignedPupils,
        unassignSubject,
        deleteSubject,
        getAcademicYear,
        addAcademicYear,
        getAssignedSubjects} = require('../controller/AdminController');

const authMiddleware = require('../middleware/authMiddleware');
const { createSubject, getAllSubjects } = require('../controller/subjectController');

const router = express.Router();

// Route: Create a new pupil (Admin-only)
router.post('/create-pupil', authMiddleware(['admin']), createPupil);

// Route: View all pupils (Admin-only)
router.get('/pupils', authMiddleware(['admin']), viewAllPupils);
//get a single pupil by id
router.get('/pupil/:email', authMiddleware(['admin', 'pupil']), viewSinglePupil);
//search pupil by name
router.get('/pupils/search', authMiddleware(['admin']), SearchPupil);
// Route: Update pupil profile
router.put('/pupil/:email', authMiddleware(['admin', 'pupil']), updatePupil);
// Route: Delete a pupil by ID (Admin-only)
router.delete('/pupil/:pupilId', authMiddleware(['admin']), deletePupil);




// Route: Assign subjects to a pupil (Admin-only)
router.post('/subject/assign-pupil', authMiddleware(['admin']), assignSubject);
router.get('/pupils/assignments', authMiddleware(['admin']), getAssignedPupils);
router.delete('/subject/unassign-pupil', authMiddleware(['admin']), unassignSubject);
router.get('/pupils/:pupilId/subjects', getAssignedSubjects);

//create subjects route
router.get('/subjects', authMiddleware(['admin']), getAllSubjects);
router.post('/create-subject', authMiddleware(['admin']), createSubject);
router.delete('/subjects/:subjectId', authMiddleware(['admin']), deleteSubject);

//Academic Year routes
router.get('/academic-years', authMiddleware(['admin', 'pupils']), getAcademicYear);
router.post('/add-academic-year', authMiddleware(['admin']), addAcademicYear);





module.exports = router; 
