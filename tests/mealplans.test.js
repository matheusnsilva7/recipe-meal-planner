const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const MealPlan = require('../models/MealPlan');

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

describe('GET /mealplans endpoints', () => {
  const userId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');

  it('should return an empty array when no meal plans exist', async () => {
    const res = await request(app).get('/mealplans');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return all meal plans', async () => {
    const mealPlan = await MealPlan.create({
      userId,
      recipeId: new mongoose.Types.ObjectId(),
      mealType: 'breakfast',
      notes: 'Test note',
    });

    const res = await request(app).get('/mealplans');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].mealType).toBe('breakfast');
    expect(res.body[0].notes).toBe('Test note');
  });

  it('should return a meal plan by id', async () => {
    const mealPlan = await MealPlan.create({
      userId: new mongoose.Types.ObjectId(),
      recipeId: new mongoose.Types.ObjectId(),
      mealType: 'lunch',
      notes: 'Lunch test',
    });

    const res = await request(app).get(`/mealplans/${mealPlan._id}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.mealType).toBe('lunch');
    expect(res.body.notes).toBe('Lunch test');
  });

  it('should return 404 if meal plan id does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/mealplans/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});