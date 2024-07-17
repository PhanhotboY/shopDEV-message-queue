const { connectToRabbitMQ4Test } = require('../dbs/rabbit.init');

describe('Test RabbitMQ connection', () => {
  it('should connect to RabbitMQ successfully', async () => {
    const result = await connectToRabbitMQ4Test();
    expect(result).toBeUndefined();
  });
});
