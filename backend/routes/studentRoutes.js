//routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const studentController = require('../controllers/studentController');

router.get('/details', studentController.getStudentDetails);
router.get('/report', studentController.getStudentReport);
router.get('/available-courses', studentController.getAvailableCourses);
router.post('/enroll', studentController.enrollInCourse);
router.get('/performance-detail', studentController.getStudentPerformanceDetail);


module.exports = router;
