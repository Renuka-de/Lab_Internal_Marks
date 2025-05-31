//routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');


router.post('/departments', adminController.addDepartment);
router.delete('/departments/:id', adminController.deleteDepartment);

router.get('/courses', adminController.getCourses);
router.post('/courses', adminController.addCourse);
router.delete('/courses/:id', adminController.deleteCourse);
router.get('/faculties', adminController.getFaculties);     
router.get('/students', adminController.getStudents); 
router.delete('/faculties/:id', adminController.deleteFaculty); 
router.delete('/students/:id', adminController.deleteStudent); 
router.post('/generate-report', adminController.generateReport);
module.exports = router;
