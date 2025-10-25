const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], required: true },
  
  // Liên kết đến "Student" nếu role là student
  studentProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    optional: true,
  },
  
  // *** THÊM MỚI ***
  // Liên kết đến "Teacher" nếu role là teacher
  teacherProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    optional: true,
  }
});

// (Các hàm pre-save và comparePassword giữ nguyên...)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);