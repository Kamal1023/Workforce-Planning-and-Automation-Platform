const request = require('supertest');
const app = require('../server');
const { User } = require('../models');

describe('Authentication API', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    role: 'HR'
  };

  beforeAll(async () => {
    // Create test user
    await User.create(testUser);
  });

  afterAll(async () => {
    // Clean up test user
    await User.destroy({ where: { email: testUser.email } });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe(testUser.email);
    });

    it('should not login with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should not login with missing email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          password: testUser.password
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Email and password are required');
    });

    it('should not login with missing password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Email and password are required');
    });

    it('should not login with empty email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: '',
          password: testUser.password
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Email and password are required');
    });

    it('should not login with empty password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: ''
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Email and password are required');
    });
  });

  describe('GET /api/auth/me', () => {
    let token;

    beforeAll(async () => {
      // Get token for authenticated requests
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      token = res.body.token;
    });

    it('should get current user with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe(testUser.email);
      expect(res.body.role).toBe(testUser.role);
    });

    it('should not get current user without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('No token provided');
    });

    it('should not get current user with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Invalid token');
    });

    it('should not get current user with expired token', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6IkhSIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.4Adcj3UFYzPUVaY53FhJQw0q1LZ4zHdWUyJzV7JQ9k';
      
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Token expired');
    });
  });
}); 