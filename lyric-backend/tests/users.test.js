const request = require('supertest');
const express = require('express');
const usersRouter = require('../routes/users');

jest.mock('../models/user', () => {
  let mockUsers = [
    { _id: '1', name: 'User1', email: 'user1@example.com', password: 'hashed', verified: true },
    { _id: '2', name: 'User2', email: 'user2@example.com', password: 'hashed', verified: false }
  ];
  function getInitialUsers() {
    return [
      { _id: '1', name: 'User1', email: 'user1@example.com', password: 'hashed', verified: true },
      { _id: '2', name: 'User2', email: 'user2@example.com', password: 'hashed', verified: false }
    ];
  }
  function User(data) {
    Object.assign(this, data);
  }
  User.prototype.save = jest.fn(function () {
    if (mockUsers.find(u => u.email === this.email)) {
      const err = new Error('duplicate');
      err.code = 11000;
      throw err;
    }
    mockUsers.push(this);
    return Promise.resolve(this);
  });
  User.find = jest.fn(() => ({ select: jest.fn(() => Promise.resolve(mockUsers)) }));
  User.findOne = jest.fn((query) => ({ explain: jest.fn(() => Promise.resolve(query.email === 'user1@example.com' ? mockUsers[0] : null)) }));
  User.findById = jest.fn((id) => ({ select: jest.fn(() => Promise.resolve(mockUsers.find(u => u._id === id))) }));
  User.findByIdAndUpdate = jest.fn((id, update) => ({ select: jest.fn(() => Promise.resolve({ ...mockUsers[0], ...update.$set })) }));
  User.findByIdAndDelete = jest.fn((id) => Promise.resolve(mockUsers.find(u => u._id === id) ? { _id: id } : null));
  User.updateOne = jest.fn(() => Promise.resolve());
  return {
    User,
    validate: jest.fn((data) => {
      if (!data.email || !data.password || !data.name) {
        return { error: { details: [{ message: 'Missing fields' }] } };
      }
      return { error: null };
    }),
    __resetUsers: () => { mockUsers = getInitialUsers(); }
  };
});

jest.mock('../models/token', () => ({
  Token: {
    findOne: jest.fn(() => Promise.resolve({ remove: jest.fn(() => Promise.resolve()) }))
  }
}));

jest.mock('../middleware/auth', () => (req, res, next) => next());
jest.mock('../middleware/admin', () => (req, res, next) => next());
jest.mock('../middleware/validateObjectId', () => (req, res, next) => next());

beforeEach(() => {
  require('../models/user').__resetUsers();
});

describe('Users Route', () => {
  let app;
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/users', usersRouter);
  });

  it('should return 400 if required fields are missing on POST', async () => {
    const res = await request(app).post('/api/users').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('should return 403 if user already exists', async () => {
    const res = await request(app).post('/api/users').send({ name: 'User1', email: 'user1@example.com', password: 'pass', gender: 'M' });
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/already exists/);
  });

  it('should create a user with valid data', async () => {
    const res = await request(app).post('/api/users').send({ name: 'New', email: 'new@example.com', password: 'pass', gender: 'F' });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/created successfully/);
  });

  it('should get all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should get a user by id', async () => {
    const res = await request(app).get('/api/users/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('name', 'User1');
  });

  it('should update a user by id', async () => {
    const res = await request(app).put('/api/users/1').send({ name: 'Updated' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('name', 'Updated');
  });

  it('should delete a user by id', async () => {
    const res = await request(app).delete('/api/users/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Successfully deleted/);
  });
});
