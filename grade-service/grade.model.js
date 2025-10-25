const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gradeSchema = new Schema({
  subjectName: { type: String, required: true },
  score: { type: Number, required: true, min: 0, max: 10 },
  studentId: { type: Schema.Types.ObjectId, required: true } // ID của sinh viên từ student-service
}, { timestamps: true });

module.exports = mongoose.model('Grade', gradeSchema);