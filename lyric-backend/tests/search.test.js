const request = require('supertest');
const express = require('express');
const searchRouter = require('../routes/search');

jest.mock('../middleware/auth', () => (req, res, next) => next());

jest.mock('../models/song', () => ({
  Song: {
    find: jest.fn(() => ({
      limit: jest.fn(() => Promise.resolve([{ name: 'Test Song' }]))
    }))
  }
}));

describe('Search Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/search', searchRouter);
  });

  it('should return 200 and empty object if search query is empty', async () => {
    const res = await request(app).get('/api/search?search=');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({});
  });

  it('should return 200 and a songs array for a valid search', async () => {
    const res = await request(app).get('/api/search?search=Test');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('songs');
    expect(Array.isArray(res.body.songs)).toBe(true);
    expect(res.body.songs[0]).toHaveProperty('name', 'Test Song');
  });

  it('should handle non-string search query gracefully', async () => {
    const res = await request(app).get('/api/search?search=123');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('songs');
    expect(Array.isArray(res.body.songs)).toBe(true);
  });
});
