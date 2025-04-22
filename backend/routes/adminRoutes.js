//routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/departments', adminController.getDepartments);
router.post('/departments', adminController.addDepartment);
router.delete('/departments/:id', adminController.deleteDepartment);

router.get('/courses', adminController.getCourses);
router.post('/courses', adminController.addCourse);
router.delete('/courses/:id', adminController.deleteCourse);

module.exports = router;
