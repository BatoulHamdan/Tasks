const request = require('supertest');
const { app } = require('../app');
const axios = require('axios');
jest.mock('axios');
const mongoose = require('mongoose');

const MONGO = process.env.MONGO_CONNECTION;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await mongoose.connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  const collections = Object.values(mongoose.connection.collections);
  for (const collection of collections) {
    await collection.deleteMany({});
  }
  await mongoose.disconnect();
});

afterEach(async () => {
  const Item = require('../Models/Item');
  await Item.deleteMany({});
  jest.clearAllMocks();
});

describe('Item API', () => {
  test('POST /api/items with valid mobile stores mobileDetails', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        valid: true,
        countryCode: 'US',
        countryCallingCode: '+1',
        countryName: 'United States',
        operatorName: 'N/A'
      }
    });

    const res = await request(app)
      .post('/api/items')
      .send({ name: 'Alice', description: 'desc', mobileNumber: '+14155552671' });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Alice');
    expect(res.body.mobileDetails).toBeDefined();
    expect(res.body.mobileDetails.countryCode).toBe('US');
  });

  test('POST /api/items with invalid mobile returns 400', async () => {
    axios.post.mockResolvedValueOnce({ data: { valid: false } });

    const res = await request(app)
      .post('/api/items')
      .send({ name: 'Bob', mobileNumber: '1234' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid mobile number');
  });

  test('GET /api/items returns empty array initially', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});
