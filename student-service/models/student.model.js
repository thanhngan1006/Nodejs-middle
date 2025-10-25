const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  major: { type: String, required: true },
  
  // Trường GPA này giờ CHỈ LÀ NƠI LƯU TRỮ
  // Nó sẽ được cập nhật bởi Listener
  gpa: {
    type: Number,
    default: 0.0 
  },
  
  phoneNumber: { type: String, default: "" },
  dateOfBirth: { type: Date, default: null },
  address: { type: String, default: "" },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Graduated'],
    default: 'Active'
  }
});

module.exports = mongoose.model('Student', StudentSchema);