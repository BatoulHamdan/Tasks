const request = require('supertest');
const createApp = require('../app'); 
let app;

beforeAll(() => {
  const app = require('../app').app; 
  app = app.listen(0);
});

afterAll(async () => {
  await app.close();
});

describe('POST /validate', () => {
  test('returns valid for a correct international number', async () => {
    const res = await request(app).post('/validate').send({ mobile: '+14155552671' });
    expect(res.statusCode).toBe(200);
    expect(res.body.valid).toBe(true);
    expect(res.body.countryCode).toBe('US');
    expect(res.body.countryCallingCode).toBe('+1');
    expect(res.body.countryName).toMatch(/United/);
  });

  test('returns 400 for invalid number', async () => {
    const res = await request(app).post('/validate').send({ mobile: '1234' });
    expect(res.statusCode).toBe(400);
    expect(res.body.valid).toBe(false);
  });

  test('returns 400 for missing mobile', async () => {
    const res = await request(app).post('/validate').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
