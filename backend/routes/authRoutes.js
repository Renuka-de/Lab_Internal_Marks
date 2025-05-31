const express = require('express');
const router = express.Router();
const { register, login, getDepartments} = require('../controllers/authController');

router.post('/register',register);
router.post('/login', login);
router.get('/departments', getDepartments);


module.exports = router;
