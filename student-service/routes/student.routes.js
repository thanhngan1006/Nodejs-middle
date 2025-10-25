// backend/routes/student.routes.js
const express = require('express');
const router = express.Router();
const { authenticateToken, isTeacher } = require('../middleware/auth.js');

// Import controller
const studentController = require('../controllers/student.controller.js');

// Áp dụng middleware cho tất cả các route bên dưới
router.use(authenticateToken, isTeacher);

// Định nghĩa routes
router.post('/', studentController.createStudent);        // CREATE
router.get('/', studentController.getAllStudents);        // READ
router.put('/:id', studentController.updateStudent);      // UPDATE
router.delete('/:id', studentController.deleteStudent);   // DELETE

module.exports = router;