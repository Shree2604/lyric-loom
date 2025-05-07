const request = require('supertest');
const express = require('express');
const sharedFavoritesRouter = require('../routes/sharedFavorites');

const mockShared = { shareId: 'abc123', songs: ['1', '2'] };
const mockPopulated = { shareId: 'abc123', songs: [{ _id: '1', name: 'Song1' }] };

jest.mock('../models/SharedFavorites', () => ({
  create: jest.fn((data) => Promise.resolve({ shareId: 'abc123' })),
  findOne: jest.fn(({ shareId }) => {
    if (shareId === 'abc123') {
      return { populate: jest.fn(() => Promise.resolve(mockPopulated)) };
    } else {
      return { populate: jest.fn(() => Promise.resolve(null)) };
    }
  })
}));

jest.mock('../models/song', () => ({}));

jest.mock('uuid', () => ({ v4: () => 'abc123' }));

describe('SharedFavorites Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/shared-favorites', sharedFavoritesRouter);
  });

  it('should return 400 if songs array is missing or empty on POST', async () => {
    const res = await request(app).post('/api/shared-favorites').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/No songs provided/);
    const res2 = await request(app).post('/api/shared-favorites').send({ songs: [] });
    expect(res2.statusCode).toBe(400);
  });

  it('should create a shared favorites list with valid songs array', async () => {
    const res = await request(app).post('/api/shared-favorites').send({ songs: ['1', '2'] });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('shareId', 'abc123');
  });

  it('should return songs for a valid shareId', async () => {
    const res = await request(app).get('/api/shared-favorites/abc123');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('songs');
    expect(Array.isArray(res.body.songs)).toBe(true);
    expect(res.body.songs[0]).toHaveProperty('name', 'Song1');
  });

  it('should return 404 for not found shareId', async () => {
    const res = await request(app).get('/api/shared-favorites/notfound');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/Not found/);
  });
});
