const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. IMPORT LISTENER TỪ BƯỚC 5
const { startGpaListener } = require('./gpaListener.js');

const app = express();
const PORT = process.env.PORT || 5000;
// Service này kết nối đến database 'studentdb'
const DB_URL = process.env.DB_URL || 'mongodb://db:27017/studentdb';

// Middleware
app.use(cors());
app.use(express.json()); // Cho phép server đọc JSON

// Kết nối MongoDB
mongoose.connect(DB_URL)
  .then(() => console.log('Student-Service connected to MongoDB (studentdb).'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sử dụng các routes (API Endpoints)
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/students', require('./routes/student.routes'));
app.use('/api/profile', require('./routes/profile.routes')); // API cho Student
app.use('/api/teacher-profile', require('./routes/teacherProfile.routes.js')); // API cho Teacher

// Route cơ bản để kiểm tra service
app.get('/', (req, res) => {
  res.send('Student-Service API is running!');
});

// Khởi chạy server
app.listen(PORT, () => {
  console.log(`Student-Service (Replica) listening on port ${PORT}`);
  
  // 2. GỌI LISTENER KHI SERVER SẴN SÀNG
  // Bắt đầu lắng nghe tin nhắn cập nhật GPA
  startGpaListener(); 
});