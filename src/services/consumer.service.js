const { connectToRabbitMQ, consumeQueue } = require('../dbs/rabbit.init');

const consumeMessage = async (queue) => {
  try {
    const result = await connectToRabbitMQ();
    if (!result) throw new Error('Error connecting to RabbitMQ');

    const { channel, connection } = result;
    await channel.checkQueue(queue);
    // await channel.prefetch(1);
    /*global channel, msg*/
    // setTimeout(async () => {
    await channel.consume(queue, (msg) => {
      // if (msg.content.toString() !== 'success')
      //   return channel.nack(msg, false, false);

      setTimeout(() => {
        console.log('[SUCCESS] - Message received:', msg.content.toString());
        channel.ack(msg);
      }, Math.random() * 1000);
    });

    // }, 10000);
  } catch (error) {
    console.error('Error consuming failed notification', error);

    channel.nack(msg, false, false);
  }
};

const consumeFailedMessage = async () => {
  try {
    const result = await connectToRabbitMQ();
    if (!result) throw new Error('Error connecting to RabbitMQ');
    const { channel, connection } = result;

    const notiExchangeDLX = 'notification-exchange-dlx';
    const notiQueueDLX = 'notification-queue-dlx';
    const notiRoutingKeyDLX = 'notification-routing-key-dlx';

    await channel.assertExchange(notiExchangeDLX, 'direct', { durable: true });
    await channel.assertQueue(notiQueueDLX, { exclusive: false });
    await channel.bindQueue(notiQueueDLX, notiExchangeDLX, notiRoutingKeyDLX);

    await channel.consume(notiQueueDLX, (failedMsg) => {
      console.log(
        '[FAILED] - Message received from DLX:',
        failedMsg.content.toString()
      );

      channel.ack(failedMsg);
    });
  } catch (error) {
    console.error('Error consuming failed notification', error);
  }
};

module.exports = { consumeMessage, consumeFailedMessage };
