const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Tag = require('../models/Tag');

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

describe('GET /tags endpoints', () => {
  it('should return an empty array when no tags exist', async () => {
    const res = await request(app).get('/tags');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return all tags', async () => {
    const tag = await Tag.create({
      name: 'Vegetarian',
      description: 'No meat',
    });

    const res = await request(app).get('/tags');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Vegetarian');
  });

  it('should return a tag by id', async () => {
    const tag = await Tag.create({
      name: 'Gluten-Free',
      description: 'No gluten',
    });

    const res = await request(app).get(`/tags/${tag._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Gluten-Free');
  });

  it('should return 404 if tag id does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/tags/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});