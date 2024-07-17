const amqp = require('amqplib');

async function connectToRabbitMQ() {
  try {
    const connection = await amqp.connect('amqp://admin:hi@localhost');
    if (!connection) {
      throw new Error('Error in connecting to RabbitMQ');
    }

    const channel = await connection.createChannel();
    if (!channel) {
      throw new Error('Error in creating channel');
    }

    return { channel, connection };
  } catch (error) {
    console.log('Error in creating RabbitMQ connection', error);
  }
}

async function connectToRabbitMQ4Test() {
  try {
    const result = await connectToRabbitMQ();
    if (!result) {
      throw new Error('Error in connecting to RabbitMQ');
    }
    const { channel, connection } = result;

    const queue = 'test_queue';

    await channel.assertQueue(queue, { durable: false });
    await channel.sendToQueue(queue, Buffer.from('Hello from RabbitMQ'));

    return await connection.close();
  } catch (error) {
    console.log('Error in connecting to RabbitMQ', error);
  }
}

const consumeQueue = async ({ channel, queue }) => {
  try {
    setTimeout(async () => {
      await channel.checkQueue(queue);

      await channel.consume(
        queue,
        (msg) => {
          console.log('Message received from Backend:', msg.content.toString());
        },
        { noAck: true }
      );
    }, 2000);
  } catch (error) {
    console.log('Error in consuming queue', error);
  }
};

module.exports = { connectToRabbitMQ, connectToRabbitMQ4Test, consumeQueue };
