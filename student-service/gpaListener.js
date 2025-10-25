const amqp = require('amqplib');
const Student = require('./models/student.model'); // Import Student model

const RABBITMQ_URL = 'amqp://rabbitmq';

async function startGpaListener() {
  console.log('[Student-Service] Khởi động GPA Listener...');
  
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    const QUEUE_NAME = 'gpa_updated';
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log(`[Student-Service] Lắng nghe hàng đợi ${QUEUE_NAME}...`);
    
    // Bắt đầu lắng nghe
    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());
          
          // Log lại thông tin nhận được
          console.log(`[Student-Service] Nhận được cập nhật GPA: SV ${data.studentId} - GPA mới ${data.newGPA}`);
          
          // Cập nhật GPA trong database của student-service
          await Student.findByIdAndUpdate(data.studentId, { gpa: data.newGPA });
          
          console.log(`[Student-Service] Đã cập nhật GPA cho SV ${data.studentId} thành công.`);
          
          // Báo cho RabbitMQ là đã xử lý xong
          channel.ack(msg);
        } catch (error) {
          console.error("[Student-Service] Lỗi cập nhật GPA:", error.message);
          // Trả tin nhắn về queue nếu lỗi (để thử lại sau)
          channel.nack(msg, false, true);
        }
      }
    });
  } catch (error) {
    console.error('[Student-Service] GPA listener error, retrying in 5s...', error.message);
    setTimeout(startGpaListener, 5000);
  }
}

// Export hàm để server.js có thể gọi
module.exports = { startGpaListener };