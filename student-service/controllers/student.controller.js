// backend/controllers/student.controller.js
const Student = require('../models/student.model.js');
const User = require('../models/user.model.js');
const { sendToQueue } = require('../messageBroker');

// 1. Logic cho CREATE
exports.createStudent = async (req, res) => {
  try {
    // Lấy 'password' ra khỏi req.body
    const { 
      email, password, name, studentId, major, ...otherFields 
    } = req.body;
    
    const user = new User({ email, password, role: 'student' });
    
    const student = new Student({
      user: user._id,
      name,
      studentId,
      major,
      ...otherFields
    });
    
    user.studentProfile = student._id;
    
    await user.save();
    await student.save();
    
    // *** CẬP NHẬT Ở ĐÂY ***
    // Gửi thêm 'password' vào tin nhắn
    try {
      sendToQueue('student_created', { 
        email: user.email, 
        name: student.name,
        password: password // Thêm trường này
      });
    } catch (amqpError) {
      console.error("AMQP send error (non-blocking):", amqpError);
    }
    // ************************
    
    res.status(201).json(student);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// 2. Logic cho READ (All)
exports.getAllStudents = async (req, res) => {
  const students = await Student.find().populate('user', 'email');
  res.json(students);
};

// 3. Logic cho UPDATE
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.sendStatus(404);
    res.json(student);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// 4. Logic cho DELETE
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.sendStatus(404);

    await User.findByIdAndDelete(student.user);
    await Student.findByIdAndDelete(req.params.id);
    
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

