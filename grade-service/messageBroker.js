const amqp = require('amqplib');
const RABBITMQ_URL = 'amqp://rabbitmq';
let channel = null;

const connect = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('Grade-Service connected to RabbitMQ');
  } catch (error) {
    console.error('Grade-Service failed to connect to RabbitMQ, retrying...', error.message);
    setTimeout(connect, 5000);
  }
};

const publishToQueue = async (queueName, data) => {
  if (!channel) return;
  try {
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true });
  } catch (error) {
    console.error('Failed to send message:', error);
  }
};

connect();
module.exports = { publishToQueue };