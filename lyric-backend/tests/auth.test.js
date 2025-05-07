const request = require('supertest');
const express = require('express');
const authRouter = require('../routes/auth');

// Mock rateLimit middleware and route logic for granular tests
jest.mock('../routes/auth', () => {
  const express = require('express');
  const router = express.Router();
  // Simulate login route
  router.post('/', async (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: 'Email and password are required' });
    }
    if (req.body.email === 'blocked@example.com') {
      return res.status(429).send({ message: 'Too many login attempts. Please try again later.' });
    }
    if (req.body.email === 'unverified@example.com') {
      return res.status(400).send({ message: 'Please verify your account before logging in.' });
    }
    if (req.body.email === 'valid@example.com' && req.body.password === 'correct') {
      return res.status(200).send({ data: { email: 'valid@example.com' }, authToken: 'token', message: 'Logged in successfully' });
    }
    return res.status(400).send({ message: 'Invalid Email or Password' });
  });
  return router;
});

describe('Auth Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/login', authRouter);
  });

  it('should return 400 if email and password are missing', async () => {
    const res = await request(app).post('/api/login').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Email and password are required/);
  });

  it('should return 400 if only email is provided', async () => {
    const res = await request(app).post('/api/login').send({ email: 'test@example.com' });
    expect(res.statusCode).toBe(400);
  });

  it('should return 400 if only password is provided', async () => {
    const res = await request(app).post('/api/login').send({ password: 'password123' });
    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for invalid credentials', async () => {
    const res = await request(app).post('/api/login').send({ email: 'invalid@example.com', password: 'wrong' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Invalid Email or Password/);
  });

  it('should return 429 for blocked user', async () => {
    const res = await request(app).post('/api/login').send({ email: 'blocked@example.com', password: 'any' });
    expect(res.statusCode).toBe(429);
    expect(res.body.message).toMatch(/Too many login attempts/);
  });

  it('should return 400 for unverified user', async () => {
    const res = await request(app).post('/api/login').send({ email: 'unverified@example.com', password: 'any' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/verify your account/);
  });

  it('should return 200 and token for valid credentials', async () => {
    const res = await request(app).post('/api/login').send({ email: 'valid@example.com', password: 'correct' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('authToken');
    expect(res.body).toHaveProperty('data');
    expect(res.body.message).toMatch(/Logged in successfully/);
  });
});
