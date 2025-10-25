// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware 1: Xác thực Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (token == null) return res.sendStatus(401); // Không có token

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Token không hợp lệ
    req.user = user; // Lưu thông tin user (từ token) vào request
    next(); // Đi tiếp
  });
};

// Middleware 2: Kiểm tra vai trò Teacher
const isTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).send('Access denied. Teachers only.');
  }
  next();
};

// Middleware 3: Kiểm tra vai trò Student
const isStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).send('Access denied. Students only.');
  }
  next();
};

module.exports = { authenticateToken, isTeacher, isStudent };