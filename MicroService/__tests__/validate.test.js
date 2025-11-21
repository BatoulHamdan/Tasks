const request = require('supertest');
const { app } = require('../app'); 

describe('POST /phoneValidation', () => {
  test('Valid international number returns correct data', async () => {
    const res = await request(app)
      .post('/phoneValidation')
      .send({ mobile: '+14155552671' });

    expect(res.statusCode).toBe(200);
    expect(res.body.valid).toBe(true);
    expect(res.body.countryCode).toBe('US');
    expect(res.body.countryCallingCode).toBe('+1');
    expect(res.body.countryName).toBe('United States');
  });

  test('Invalid number returns 400', async () => {
    const res = await request(app)
      .post('/phoneValidation')
      .send({ mobile: '1234' });

    expect(res.statusCode).toBe(400);
    expect(res.body.valid).toBe(false);
  });

  test('Missing mobile returns error', async () => {
    const res = await request(app)
      .post('/phoneValidation')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Missing mobile field');
  });
});
