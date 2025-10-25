const amqp = require('amqplib');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Tải file .env

const QUEUE_NAME = 'student_created';
const RABBITMQ_URL = 'amqp://rabbitmq';

// --- CẤU HÌNH NODEMAILER ---
// Kiểm tra xem biến môi trường đã được nạp chưa
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("LỖI: EMAIL_USER hoặc EMAIL_PASS không được tìm thấy trong file .env.");
    process.exit(1); // Dừng service nếu thiếu thông tin
}

// Tạo "người vận chuyển" (transporter)
const transporter = nodemailer.createTransport({
    service: 'gmail', // Sử dụng Gmail
    auth: {
        user: process.env.EMAIL_USER, // Email của bạn
        pass: process.env.EMAIL_PASS  // Mật khẩu ứng dụng 16 số
    }
});

// --- KẾT NỐI RABBITMQ ---
async function connectToRabbitMQ() {
    console.log('Connecting to RabbitMQ...');
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME, { durable: true });

        console.log(`[+] Waiting for messages in queue: ${QUEUE_NAME}`);

        // Bắt đầu lắng nghe
        channel.consume(QUEUE_NAME, async (msg) => { // Thêm 'async'
            if (msg !== null) {
                try {
                    const content = msg.content.toString();
                    const student = JSON.parse(content); // 'student' giờ đã có { email, name, password }

                    console.log(`[+] Nhận được tin nhắn cho: ${student.email}. Đang gửi email...`);

                    // --- CẬP NHẬT NỘI DUNG EMAIL ---
                    const mailOptions = {
                        from: `"StdPortal" <${process.env.EMAIL_USER}>`,
                        to: student.email,
                        subject: 'Chào mừng bạn đến với StdPortal!',
                        html: `
              <h1>Chào mừng ${student.name}!</h1>
              <p>Tài khoản của bạn tại StdPortal đã được tạo thành công.</p>
              <p>Bạn có thể đăng nhập ngay bây giờ với thông tin sau:</p>
              <br>
              <ul style="font-family: monospace; font-size: 1.1em; list-style-type: none; padding: 10px; background-color: #f4f4f4; border-radius: 5px;">
                <li><strong>Email:</strong> ${student.email}</li>
                <li><strong>Mật khẩu:</strong> ${student.password}</li>
              </ul>
              <br>
              <p><i>Vì lý do bảo mật, bạn vui lòng đổi mật khẩu sau khi đăng nhập lần đầu tiên.</i></p>
              <br>
              <p>Trân trọng,</p>
              <p>Ban Quản trị StdPortal</p>
            `
                    };
                    // ------------------------------

                    await transporter.sendMail(mailOptions);

                    console.log(`[SUCCESS] Đã gửi email chào mừng đến ${student.email}`);

                    channel.ack(msg);
                } catch (error) {
                    console.error('Lỗi khi xử lý tin nhắn:', error.message);
                    channel.nack(msg, false, true);
                }
            }
        });
    } catch (error) {
        console.error('Failed to connect to RabbitMQ, retrying in 5s...', error.message);
        setTimeout(connectToRabbitMQ, 5000);
    }
}

connectToRabbitMQ();