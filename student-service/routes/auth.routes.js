// backend/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');

// Route để tạo tài khoản (ví dụ: tạo teacher)
router.post('/register', authController.register);

// Route để đăng nhập
router.post('/login', authController.login);

module.exports = router;