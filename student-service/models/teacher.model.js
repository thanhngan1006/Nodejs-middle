const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  department: { type: String, required: true },

  // --- BỔ SUNG CÁC TRƯỜNG MỚI ---
  position: { type: String, default: "" }, // Ví dụ: "Giảng viên", "Trợ giảng"
  phoneNumber: { type: String, default: "" },
  dateOfBirth: { type: Date, default: null },
  address: { type: String, default: "" }
});

module.exports = mongoose.model('Teacher', TeacherSchema);