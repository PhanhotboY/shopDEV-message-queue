require('dotenv').config();

const {
  consumeMessage,
  consumeFailedMessage,
} = require('./src/services/consumer.service');

const queue = 'notification';
consumeMessage(queue)
  .then(() => {
    console.log('Start consuming message from RabbitMQ');
  })
  .catch((error) => {
    console.error('Error consuming message', error);
  });

consumeFailedMessage()
  .then(() => {
    console.log('Start consuming failed message from RabbitMQ');
  })
  .catch((error) => {
    console.error('Error consuming failed message', error);
  });
