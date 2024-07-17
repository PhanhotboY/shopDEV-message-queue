require('dotenv').config();

const mongoose = require('mongoose');

const connectionString = `mongodb://${process.env.DEV_DB_USER}:${process.env.DEV_DB_PWD}@${process.env.DEV_DB_HOST}:${process.env.DEV_DB_PORT}/${process.env.DEV_DB_NAME}`;

const TestSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model('Test', TestSchema);

describe('Testing MongoDB connection', () => {
  beforeAll(async () => {
    await mongoose.connect(connectionString);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should insert a doc into collection', async () => {
    const doc = new Test({ name: 'John Doe' });
    await doc.save();
    expect(doc.isNew).toBe(false);
  });

  it('should retrieve data from the test collection', async () => {
    const doc = await Test.findOne({ name: 'John Doe' });
    expect(doc.name).toBe('John Doe');
  });
});
