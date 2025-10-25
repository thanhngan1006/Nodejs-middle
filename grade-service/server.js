const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const amqp = require('amqplib');
const Grade = require('./grade.model');
const { publishToQueue } = require('./messageBroker');

const app = express();
const PORT = process.env.PORT || 5001;
// Service này sẽ dùng 1 database riêng (gradedb) nhưng trên CÙNG 1 server MongoDB
const DB_URL = process.env.DB_URL || 'mongodb://db:27017/gradedb'; 

app.use(cors());
app.use(express.json());

mongoose.connect(DB_URL)
  .then(() => console.log('Grade-Service connected to MongoDB (gradedb).'))
  .catch(err => console.error(err));

// --- API ---

// Lấy tất cả điểm của 1 SV
app.get('/api/grades/student/:studentId', async (req, res) => {
  try {
    const grades = await Grade.find({ studentId: req.params.studentId });
    res.json(grades);
  } catch (e) { res.status(500).send(e.message); }
});

// Thêm điểm mới
app.post('/api/grades', async (req, res) => {
  try {
    const { studentId, subjectName, score } = req.body;
    const newGrade = new Grade({ studentId, subjectName, score });
    await newGrade.save();
    
    // Sau khi lưu, tính GPA MỚI
    await calculateAndPublishGPA(studentId);

    res.status(201).json(newGrade);
  } catch (e) { res.status(500).send(e.message); }
});

// (Thêm API Sửa/Xóa điểm ở đây, và cũng gọi calculateAndPublishGPA)

// --- HÀM TÍNH GPA VÀ GỬI TIN NHẮN ---
async function calculateAndPublishGPA(studentId) {
  try {
    const grades = await Grade.find({ studentId: studentId });
    
    let gpa4Scale = 0;
    if (grades.length > 0) {
      const totalScore = grades.reduce((acc, grade) => acc + grade.score, 0);
      const average10Scale = (totalScore / grades.length);
      gpa4Scale = (average10Scale * 4) / 10; // Đổi sang thang 4
    }

    // Gửi tin nhắn đến student-service
    publishToQueue('gpa_updated', { 
      studentId: studentId, 
      newGPA: gpa4Scale 
    });
    
  } catch (e) { console.error("Error calculating GPA:", e.message); }
}

// --- LISTENER (Lắng nghe) ---
// Lắng nghe tin nhắn "student_created" từ student-service
async function startListener() {
  const RABBITMQ_URL = 'amqp://rabbitmq';
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue('student_created', { durable: true });

    console.log('[Grade-Service] Lắng nghe hàng đợi student_created...');
    
    channel.consume('student_created', (msg) => {
      if (msg !== null) {
        const student = JSON.parse(msg.content.toString());
        // Khi SV mới được tạo, chúng ta chỉ cần log (hoặc tạo sổ điểm trống)
        console.log(`[Grade-Service] Nhận được SV mới: ${student.email}. Đã tạo sổ điểm.`);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Grade-Service listener error, retrying...', error.message);
    setTimeout(startListener, 5000);
  }
}

app.listen(PORT, () => {
  console.log(`Grade-Service running on port ${PORT}`);
  startListener(); // Khởi động listener
});