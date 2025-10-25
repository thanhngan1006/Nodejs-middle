// backend/routes/profile.routes.js
const express = require('express');
const router = express.Router();
const { authenticateToken, isStudent } = require('../middleware/auth.js');
const profileController = require('../controllers/profile.controller.js');

// Áp dụng middleware: Phải đăng nhập VÀ là Student
router.use(authenticateToken, isStudent);

// Route GET: Lấy thông tin cá nhân
router.get('/', profileController.getMyProfile);

// Route PUT: Cập nhật thông tin cá nhân
router.put('/', profileController.updateMyProfile);

module.exports = router;