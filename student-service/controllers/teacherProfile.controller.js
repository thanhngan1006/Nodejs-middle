// backend/controllers/teacherProfile.controller.js
const Teacher = require('../models/teacher.model.js');

// Logic GET (Giữ nguyên, không thay đổi)
exports.getMyProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.teacherProfileId).populate('user', 'email');
    if (!teacher) {
      return res.status(404).send('Teacher profile not found.');
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Logic UPDATE (Cập nhật)
exports.updateMyProfile = async (req, res) => {
  try {
    // *** CẬP NHẬT: Lấy tất cả các trường có thể sửa ***
    const { 
      name, 
      department, 
      position, 
      phoneNumber, 
      dateOfBirth, 
      address 
    } = req.body;

    // Tạo object chứa các trường cập nhật
    const updates = {
      name, 
      department, 
      position, 
      phoneNumber, 
      dateOfBirth: dateOfBirth || null, 
      address
    };

    const teacher = await Teacher.findByIdAndUpdate(
      req.user.teacherProfileId,
      { $set: updates }, // Sử dụng $set để cập nhật
      { new: true, runValidators: true } // Trả về tài liệu mới và chạy validators
    );

    if (!teacher) return res.sendStatus(404);
    res.json(teacher);
  } catch (error) {
    res.status(400).send(error.message);
  }
};