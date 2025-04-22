// routes/facultyRoutes.js
const express = require('express');
const router = express.Router();
const {
  getCoursesByFaculty,
  getStudentsInCourse,
  updateMarks,
  getFacultyDetails
} = require('../controllers/facultyController');

router.get('/courses', getCoursesByFaculty);
router.post('/update-marks', updateMarks);
router.get('/course-students', getStudentsInCourse);
router.get('/details', getFacultyDetails);

module.exports = router;
