const express = require('express');
const router = express.Router();
const { authenticateToken, isTeacher } = require('../middleware/auth.js');
const teacherProfileController = require('../controllers/teacherProfile.controller.js');

// Áp dụng middleware: Phải đăng nhập VÀ là Teacher
router.use(authenticateToken, isTeacher);

// Route GET: Lấy thông tin cá nhân
router.get('/', teacherProfileController.getMyProfile);

// Route PUT: Cập nhật thông tin cá nhân
router.put('/', teacherProfileController.updateMyProfile);

module.exports = router;