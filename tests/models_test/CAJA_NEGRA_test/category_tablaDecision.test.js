const mongoose = require('mongoose');
const Category = require('../models/category'); // Ajusta la ruta según la ubicación del archivo
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Category Model', () => {

  test('should create a category with valid data', async () => {
    const validData = {
      title: 'Electronics',
      slug: 'electronics',
      state: true
    };

    const category = await Category.create(validData);

    expect(category).toHaveProperty('title', validData.title);
    expect(category).toHaveProperty('slug', validData.slug);
    expect(category).toHaveProperty('state', validData.state);
    expect(category).toHaveProperty('createdAt');
  });

  test('should fail if title is missing', async () => {
    const invalidData = {
      // title is missing
      slug: 'electronics',
      state: true
    };

    await expect(Category.create(invalidData)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  test('should fail if slug is missing', async () => {
    const invalidData = {
      title: 'Electronics',
      // slug is missing
      state: true
    };

    await expect(Category.create(invalidData)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  test('should default state to true if not provided', async () => {
    const dataWithDefaultState = {
      title: 'Electronics',
      slug: 'electronics',
    };

    const category = await Category.create(dataWithDefaultState);

    expect(category).toHaveProperty('state', true);
  });

  test('should fail if state is not a boolean', async () => {
    const invalidData = {
      title: 'Electronics',
      slug: 'electronics',
      state: 'string' // Invalid state type
    };

    await expect(Category.create(invalidData)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  // Boundary tests
  test('should fail if title exceeds maximum length', async () => {
    const invalidData = {
      title: 'a'.repeat(256), // Assuming the maximum length is 255
      slug: 'electronics',
      state: true
    };

    await expect(Category.create(invalidData)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  test('should fail if slug exceeds maximum length', async () => {
    const invalidData = {
      title: 'Electronics',
      slug: 'a'.repeat(256), // Assuming the maximum length is 255
      state: true
    };

    await expect(Category.create(invalidData)).rejects.toThrow(mongoose.Error.ValidationError);
  });
});
const mongoose = require("mongoose");
const Category = require("../models/category"); // Ajusta la ruta según la ubicación de tu modelo

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/test_db', { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Category Model', () => {
  test('should create a category with valid data', async () => {
    const validData = {
      title: 'Electronics',
      slug: 'electronics',
      state: true
    };

    const category = await Category.create(validData);
    
    expect(category).toHaveProperty('title', validData.title);
    expect(category).toHaveProperty('slug', validData.slug);
    expect(category).toHaveProperty('state', validData.state);
    expect(category).toHaveProperty('createdAt');
  });

  test('should fail if title is missing', async () => {
    const invalidData = {
      slug: 'electronics',
      state: true
    };

    await expect(Category.create(invalidData)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  test('should fail if slug is missing', async () => {
    const invalidData = {
      title: 'Electronics',
      state: true
    };

    await expect(Category.create(invalidData)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  test('should fail if state is not a boolean', async () => {
    const invalidData = {
      title: 'Electronics',
      slug: 'electronics',
      state: 'string' // Tipo inválido para el estado
    };

    await expect(Category.create(invalidData)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  test('should default state to true if not provided', async () => {
    const dataWithDefaultState = {
      title: 'Electronics',
      slug: 'electronics',
    };

    const category = await Category.create(dataWithDefaultState);

    expect(category).toHaveProperty('state', true);
  });

  test('should fail if title exceeds maximum length', async () => {
    const invalidData = {
      title: 'a'.repeat(256), // Asumiendo longitud máxima de 255
      slug: 'electronics',
      state: true
    };

    await expect(Category.create(invalidData)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  test('should fail if slug exceeds maximum length', async () => {
    const invalidData = {
      title: 'Electronics',
      slug: 'a'.repeat(256), // Asumiendo longitud máxima de 255
      state: true
    };

    await expect(Category.create(invalidData)).rejects.toThrow(mongoose.Error.ValidationError);
  });
});
