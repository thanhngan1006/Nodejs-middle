// backend/controllers/profile.controller.js
const Student = require('../models/student.model.js');

// Logic GET (Giữ nguyên, không thay đổi)
exports.getMyProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.studentProfileId).populate('user', 'email');
    if (!student) {
      return res.status(404).send('Profile not found.');
    }
    res.json(student);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Logic UPDATE (Cập nhật)
exports.updateMyProfile = async (req, res) => {
  try {
    // *** CẬP NHẬT: Lấy tất cả các trường có thể sửa ***
    // (Student KHÔNG thể tự sửa 'status', 'gpa', 'major' ở đây)
    // (major nên được sửa bởi Teacher/Giáo vụ)
    const { 
      name, 
      phoneNumber, 
      dateOfBirth, 
      address 
    } = req.body;

    const updates = {
      name,
      phoneNumber,
      dateOfBirth: dateOfBirth || null,
      address
    };
    
    const student = await Student.findByIdAndUpdate(
      req.user.studentProfileId,
      { $set: updates }, // Sử dụng $set
      { new: true, runValidators: true }
    );

    if (!student) return res.sendStatus(404);
    res.json(student);
  } catch (error) {
    res.status(400).send(error.message);
  }
};