const request = require('supertest');
const express = require('express');
const songsRouter = require('../routes/songs');

// Mock DB models with chainable .lean(), findByIdAndUpdate, updateMany, etc.
const mockSongData = [{ _id: '1', name: 'Song1', status: 'approved' }];
const mockUpdate = { nModified: 1 };

jest.mock('../models/song', () => ({
  Song: {
    find: jest.fn(() => ({
      lean: jest.fn(() => Promise.resolve(mockSongData)),
    })),
    findByIdAndUpdate: jest.fn(() => Promise.resolve(mockSongData[0])),
    updateMany: jest.fn(() => Promise.resolve(mockUpdate)),
  },
  validate: jest.fn(),
}));

// Mock middleware
jest.mock('../middleware/auth', () => (req, res, next) => next());
jest.mock('../middleware/admin', () => (req, res, next) => next());
jest.mock('../middleware/artist', () => (req, res, next) => next());


describe('Songs Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/songs', songsRouter);
  });

  it('should return 200 and a data array on GET /', async () => {
    const res = await request(app).get('/api/songs');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should return 400 for invalid status on PATCH /:id/status', async () => {
    const res = await request(app)
      .patch('/api/songs/1/status')
      .send({ status: 'invalid' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Invalid status/);
  });

  it('should return 404 if song not found on PATCH /:id/status', async () => {
    const { Song } = require('../models/song');
    Song.findByIdAndUpdate.mockResolvedValueOnce(null); // Simulate not found
    const res = await request(app)
      .patch('/api/songs/1/status')
      .send({ status: 'approved' });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/Song not found/);
  });

  it('should return 400 for missing songIds on PATCH /bulk-status', async () => {
    const res = await request(app)
      .patch('/api/songs/bulk-status')
      .send({ status: 'approved' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/No song IDs provided/);
  });

  it('should return 400 for invalid status on PATCH /bulk-status', async () => {
    const res = await request(app)
      .patch('/api/songs/bulk-status')
      .send({ songIds: ['1'], status: 'badstatus' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Invalid status/);
  });

  it('should return 200 and result for valid PATCH /bulk-status', async () => {
    const res = await request(app)
      .patch('/api/songs/bulk-status')
      .send({ songIds: ['1'], status: 'approved' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('result');
  });
});
