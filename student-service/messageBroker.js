const amqp = require('amqplib');

const RABBITMQ_URL = 'amqp://rabbitmq';
let channel = null;

// Kết nối
const connect = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('Backend connected to RabbitMQ');
  } catch (error) {
    console.error('Backend failed to connect to RabbitMQ, retrying in 5s...', error.message);
    setTimeout(connect, 5000);
  }
};

// Hàm gửi
const sendToQueue = async (queueName, data) => {
  if (!channel) {
    console.error('RabbitMQ channel not available.');
    return;
  }
  try {
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true });
    console.log(`[+] Message sent to queue ${queueName}:`, data.email);
  } catch (error) {
    console.error('Failed to send message:', error);
  }
};

connect(); // Tự động kết nối khi server backend khởi động
module.exports = { sendToQueue };