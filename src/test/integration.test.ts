import request from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { Sequelize, DataTypes } from 'sequelize';
import Router from '@koa/router';
import User from '../models/user';
import AppointmentService from '../models/appointmentService';
import authController from '../controllers/authController';
import appointmentServiceController from '../controllers/appointmentServiceController';
import { validateBody } from '../middlewares/validate';
import { authRequired } from '../middlewares/auth';
import { registerSchema, loginSchema } from '../validators/authValidators';
import { createAppointmentServiceSchema } from '../validators/appointmentServiceValidators';
import { errorHandler } from '../middlewares/errorHandler';

let testApp: Koa;
let testSequelize: Sequelize;

beforeAll(async () => {
  // Create in-memory SQLite database
  testSequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  });

  // Initialize models with test database
  User.initialize(testSequelize, DataTypes);
  AppointmentService.initialize(testSequelize, DataTypes);

  // Sync database
  await testSequelize.sync({ force: true });

  // Setup Koa app
  testApp = new Koa();
  testApp.use(bodyParser());
  testApp.use(errorHandler);

  const router = new Router();
  router.post('/auth/register', validateBody(registerSchema), authController.register);
  router.post('/auth/login', validateBody(loginSchema), authController.login);
  router.get('/services', appointmentServiceController.list);
  router.get('/services/:id', appointmentServiceController.getById);
  router.post('/services', authRequired, validateBody(createAppointmentServiceSchema), appointmentServiceController.create);
  router.put('/services/:id', authRequired, appointmentServiceController.update);
  router.delete('/services/:id', authRequired, appointmentServiceController.remove);

  testApp.use(router.routes()).use(router.allowedMethods());
});

afterAll(async () => {
  await testSequelize.close();
});

afterEach(async () => {
  await User.destroy({ where: {} });
  await AppointmentService.destroy({ where: {} });
});

describe('Integration: Auth & Service APIs', () => {
  let authToken: string;

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(testApp.callback())
        .post('/auth/register')
        .send({
          email: 'register@test.com',
          password: 'password123',
          name: 'Register User'
        });
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe('register@test.com');
    });

    it('should reject invalid email', async () => {
      const response = await request(testApp.callback())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          name: 'User'
        });
      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      await request(testApp.callback())
        .post('/auth/register')
        .send({
          email: 'dup@test.com',
          password: 'password123',
          name: 'User 1'
        });

      const response = await request(testApp.callback())
        .post('/auth/register')
        .send({
          email: 'dup@test.com',
          password: 'password123',
          name: 'User 2'
        });
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('EMAIL_TAKEN');
    });

    it('should reject short password', async () => {
      const response = await request(testApp.callback())
        .post('/auth/register')
        .send({
          email: 'shortpass@test.com',
          password: 'short',
          name: 'User'
        });
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.message).toContain('Password');
    });

    it('should reject password exceeding 36 characters', async () => {
      const response = await request(testApp.callback())
        .post('/auth/register')
        .send({
          email: 'longpass@test.com',
          password: 'a'.repeat(37),
          name: 'User'
        });
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.message).toContain('36');
    });

    it('should reject password with special characters', async () => {
      const response = await request(testApp.callback())
        .post('/auth/register')
        .send({
          email: 'specialchar@test.com',
          password: 'Password@123!',
          name: 'User'
        });
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.message).toContain('特殊符號');
    });

    it('should accept password with mixed case and numbers', async () => {
      const response = await request(testApp.callback())
        .post('/auth/register')
        .send({
          email: 'validpass@test.com',
          password: 'AaBbCc123456',
          name: 'Valid User'
        });
      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe('validpass@test.com');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      const registerRes = await request(testApp.callback())
        .post('/auth/register')
        .send({
          email: 'login@test.com',
          password: 'password123',
          name: 'Login User'
        });
      expect(registerRes.status).toBe(200);
    });

    it('should return JWT token on valid credentials', async () => {
      const response = await request(testApp.callback())
        .post('/auth/login')
        .send({
          email: 'login@test.com',
          password: 'password123'
        });
      expect(response.status).toBe(200);
      expect(response.body.data.token).toBeDefined();
      authToken = response.body.data.token;
    });

    it('should reject invalid email', async () => {
      const response = await request(testApp.callback())
        .post('/auth/login')
        .send({
          email: 'notfound@test.com',
          password: 'password123'
        });
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should reject invalid password', async () => {
      const response = await request(testApp.callback())
        .post('/auth/login')
        .send({
          email: 'login@test.com',
          password: 'wrongpassword'
        });
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('Service CRUD', () => {
    beforeEach(async () => {
      // Create test user and get token
      await request(testApp.callback())
        .post('/auth/register')
        .send({
          email: 'service@test.com',
          password: 'password123',
          name: 'Service User'
        });

      const loginRes = await request(testApp.callback())
        .post('/auth/login')
        .send({
          email: 'service@test.com',
          password: 'password123'
        });
      authToken = loginRes.body.data.token;
    });

    it('should list public services', async () => {
      await request(testApp.callback())
        .post('/services')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Service',
          price: 100,
          isPublic: true
        });

      const response = await request(testApp.callback()).get('/services');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should create service with auth', async () => {
      const response = await request(testApp.callback())
        .post('/services')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'New Service',
          price: 150,
          isPublic: true
        });
      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('New Service');
    });

    it('should reject create without auth', async () => {
      const response = await request(testApp.callback())
        .post('/services')
        .send({
          name: 'Service',
          price: 100
        });
      expect(response.status).toBe(401);
    });

    it('should reject invalid token', async () => {
      const response = await request(testApp.callback())
        .post('/services')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          name: 'Service',
          price: 100
        });
      expect(response.status).toBe(401);
    });

    it('should soft delete service (DELETE sets isRemove=true)', async () => {
      // Create a service
      const createRes = await request(testApp.callback())
        .post('/services')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Service to Delete',
          price: 200,
          isPublic: true
        });
      expect(createRes.status).toBe(200);
      const serviceId = createRes.body.data.id;

      // Verify service is accessible before delete
      const beforeDelete = await request(testApp.callback())
        .get(`/services/${serviceId}`);
      expect(beforeDelete.status).toBe(200);
      expect(beforeDelete.body.data.isRemove).toBe(false);

      // Delete the service
      const deleteRes = await request(testApp.callback())
        .delete(`/services/${serviceId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.data.id).toBe(serviceId);

      // Verify service still exists but is marked as removed
      const afterDelete = await request(testApp.callback())
        .get(`/services/${serviceId}`);
      expect(afterDelete.status).toBe(200);
      expect(afterDelete.body.data.isRemove).toBe(true);
    });

    it('should retrieve soft-deleted services with isRemove=true filter', async () => {
      // Create two services
      const createRes1 = await request(testApp.callback())
        .post('/services')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Active Service',
          price: 100,
          isPublic: true
        });
      const serviceId1 = createRes1.body.data.id;

      const createRes2 = await request(testApp.callback())
        .post('/services')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Service to Remove',
          price: 150,
          isPublic: true
        });
      const serviceId2 = createRes2.body.data.id;

      // Delete the second service
      await request(testApp.callback())
        .delete(`/services/${serviceId2}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Get all services (no filter)
      const allRes = await request(testApp.callback()).get('/services');
      expect(allRes.body.data.length).toBe(2);

      // Get only removed services
      const removedRes = await request(testApp.callback()).get('/services?isRemove=true');
      expect(removedRes.status).toBe(200);
      expect(removedRes.body.data.length).toBe(1);
      expect(removedRes.body.data[0].id).toBe(serviceId2);
      expect(removedRes.body.data[0].isRemove).toBe(true);

      // Get only active (not removed) services
      const activeRes = await request(testApp.callback()).get('/services?isRemove=false');
      expect(activeRes.status).toBe(200);
      expect(activeRes.body.data.length).toBe(1);
      expect(activeRes.body.data[0].id).toBe(serviceId1);
      expect(activeRes.body.data[0].isRemove).toBe(false);
    });

    it('should require auth to soft delete service', async () => {
      // Create a service
      const createRes = await request(testApp.callback())
        .post('/services')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Service',
          price: 100
        });
      const serviceId = createRes.body.data.id;

      // Try to delete without auth
      const response = await request(testApp.callback())
        .delete(`/services/${serviceId}`);
      expect(response.status).toBe(401);
    });
  });
});
