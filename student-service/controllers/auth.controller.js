// backend/controllers/auth.controller.js
const User = require('../models/user.model.js');
const Teacher = require('../models/teacher.model.js');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Logic đăng ký (Giờ dùng để tạo Teacher)
exports.register = async (req, res) => {
  try {
    // *** CẬP NHẬT: Lấy tất cả các trường mới ***
    const { 
      email, password, name, employeeId, department,
      position, phoneNumber, dateOfBirth, address 
    } = req.body;

    // 1. Tạo tài khoản User
    const user = new User({
      email,
      password,
      role: 'teacher'
    });

    // 2. Tạo hồ sơ Teacher
    const teacher = new Teacher({
      user: user._id,
      name,
      employeeId,
      department,
      position,       // Thêm mới
      phoneNumber,    // Thêm mới
      dateOfBirth: dateOfBirth || null, // Thêm mới
      address         // Thêm mới
    });
    
    // 3. Liên kết User với Teacher
    user.teacherProfile = teacher._id;
    
    await user.save();
    await teacher.save();
    
    res.status(201).send('Teacher account and profile created');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Logic đăng nhập (Giữ nguyên, không thay đổi)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role, 
        studentProfileId: user.studentProfile,
        teacherProfileId: user.teacherProfile
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).send(error.message);
  }
};