// student-service/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { startGpaListener } = require('./gpaListener.js'); // Import GPA listener

// Import models và bcrypt cần thiết cho seeding
const User = require('./models/user.model');
const Teacher = require('./models/teacher.model');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
// Kết nối đến database 'studentdb'
const DB_URL = process.env.DB_URL || 'mongodb://db:27017/studentdb';

// Middleware
app.use(cors());
app.use(express.json()); // Cho phép server đọc JSON

// Kết nối MongoDB
mongoose.connect(DB_URL)
  .then(() => {
    console.log('Student-Service connected to MongoDB (studentdb).');
    // Gọi hàm seed sau khi kết nối thành công
    seedDatabase();
  })
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

  // Khởi động GPA Listener
  // Bắt đầu lắng nghe tin nhắn cập nhật GPA từ grade-service
  startGpaListener();
});

// Hàm seedDatabase (tạo tài khoản giáo viên mặc định)
async function seedDatabase() {
  try {
    const defaultTeacherEmail = "test123@gmail.com";
    // Kiểm tra xem user đã tồn tại chưa
    const existingTeacher = await User.findOne({ email: defaultTeacherEmail });

    if (!existingTeacher) {
      console.log(`[SEED] Default teacher (${defaultTeacherEmail}) not found. Creating...`);

      // Dữ liệu giáo viên mặc định
      const defaultTeacherData = {
        email: defaultTeacherEmail,
        password: "123456", // Mật khẩu gốc
        name: "Nguyen Van Test",
        employeeId: "GV0004",
        department: "IT Faculty",
        position: "Giảng viên",
        // Thêm các trường khác nếu cần (phoneNumber, dateOfBirth, address)
      };

      // 1. Tạo User (Hash password thủ công)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultTeacherData.password, salt);

      const newUser = new User({
        email: defaultTeacherData.email,
        password: hashedPassword,
        role: 'teacher'
      });

      // 2. Tạo Teacher Profile
      const newTeacherProfile = new Teacher({
        user: newUser._id,
        name: defaultTeacherData.name,
        employeeId: defaultTeacherData.employeeId,
        department: defaultTeacherData.department,
        position: defaultTeacherData.position,
        // Thêm các trường khác nếu cần
      });

      // 3. Liên kết User với Profile
      newUser.teacherProfile = newTeacherProfile._id;

      // 4. Lưu cả hai vào database
      await newUser.save();
      await newTeacherProfile.save();

      console.log(`[SEED] Default teacher (${defaultTeacherEmail}) created successfully.`);
    } else {
      console.log(`[SEED] Default teacher (${defaultTeacherEmail}) already exists.`);
    }
  } catch (error) {
     // Xử lý lỗi trùng lặp một cách nhẹ nhàng
    if (error.code === 11000) { // Lỗi duplicate key
         console.log(`[SEED] Attempted to create duplicate default teacher (${defaultTeacherEmail}), likely due to race condition. Ignoring.`);
    } else {
        console.error("[SEED] Error seeding default teacher:", error);
    }
  }
}