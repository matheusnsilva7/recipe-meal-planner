const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');

jest.mock('../middleware/auth', () => (req, res, next) => next());

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('GET /users endpoints', () => {
  it('should return an empty array when no users exist', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return all users', async () => {
    const user = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
    });

    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].email).toBe('test@example.com');
  });

  it('should return a user by id', async () => {
    const user = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
    });

    const res = await request(app).get(`/users/${user._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('test@example.com');
  });

  it('should return 404 if user id does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/users/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});