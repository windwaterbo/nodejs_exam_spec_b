import { Sequelize, DataTypes } from 'sequelize';
import appointmentServiceService from './appointmentServiceService';
import appointmentServiceRepository from '../repositories/appointmentServiceRepository';
import AppointmentService from '../models/appointmentService';

let testSequelize: Sequelize;

beforeAll(async () => {
  // Create in-memory SQLite database for testing
  testSequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  });

  // Initialize model with test database
  AppointmentService.initialize(testSequelize, DataTypes);

  // Sync database
  await testSequelize.sync({ force: true });
});

afterAll(async () => {
  await testSequelize.close();
});

describe('appointmentServiceService', () => {
  afterEach(async () => {
    await AppointmentService.destroy({ where: {} });
  });

  describe('create', () => {
    it('should create a new appointment service', async () => {
      const payload = {
        name: 'Hair Cut',
        description: 'Professional hair cutting service',
        price: 50,
        showTime: 30,
        isPublic: true
      };
      const result = await appointmentServiceService.create(payload);
      expect(result.name).toBe(payload.name);
      expect(result.price).toBe(payload.price);
      expect(result.isPublic).toBe(true);
    });

    it('should set default values for optional fields', async () => {
      const payload = {
        name: 'Massage',
        price: 100
      };
      const result = await appointmentServiceService.create(payload);
      expect(result.order).toBe(0);
      expect(result.isRemove).toBe(false);
      expect(result.isPublic).toBe(true);
    });
  });

  describe('list (filters)', () => {
    it('should return all services when no filters provided', async () => {
      await AppointmentService.create({ name: 'One', price: 10, isPublic: true, isRemove: false });
      await AppointmentService.create({ name: 'Two', price: 20, isPublic: false, isRemove: true });

      const result = await appointmentServiceService.list();
      expect(result.length).toBe(2);
    });

    it('should filter by isPublic=true (public services only)', async () => {
      await AppointmentService.create({ name: 'Public', price: 10, isPublic: true, isRemove: false });
      await AppointmentService.create({ name: 'Private', price: 20, isPublic: false, isRemove: false });

      const result = await appointmentServiceService.list({ isPublic: true });
      expect(result.length).toBe(1);
      expect(result[0].isPublic).toBe(true);
    });

    it('should filter by isRemove=false (non-removed services only)', async () => {
      await AppointmentService.create({ name: 'Active', price: 10, isPublic: true, isRemove: false });
      await AppointmentService.create({ name: 'Removed', price: 20, isPublic: true, isRemove: true });

      const result = await appointmentServiceService.list({ isRemove: false });
      expect(result.length).toBe(1);
      expect(result[0].isRemove).toBe(false);
    });

    it('should filter by isRemove=true (soft-deleted services only)', async () => {
      await AppointmentService.create({ name: 'Active', price: 10, isPublic: true, isRemove: false });
      await AppointmentService.create({ name: 'Removed', price: 20, isPublic: true, isRemove: true });

      const result = await appointmentServiceService.list({ isRemove: true });
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Removed');
      expect(result[0].isRemove).toBe(true);
    });

    it('should support combining multiple filters', async () => {
      await AppointmentService.create({ name: 'Public Active', price: 10, isPublic: true, isRemove: false });
      await AppointmentService.create({ name: 'Public Removed', price: 20, isPublic: true, isRemove: true });
      await AppointmentService.create({ name: 'Private Active', price: 30, isPublic: false, isRemove: false });

      const result = await appointmentServiceService.list({ isPublic: true, isRemove: false });
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Public Active');
    });

    it('should filter by shopId', async () => {
      const s1 = await AppointmentService.create({ name: 'S1', price: 10, shopId: 'shop-1' });
      await AppointmentService.create({ name: 'S2', price: 20, shopId: 'shop-2' });

      const result = await appointmentServiceService.list({ shopId: 'shop-1' });
      expect(result.length).toBe(1);
      expect(result[0].shopId).toBe('shop-1');
    });

    it('should filter by id', async () => {
      const created = await AppointmentService.create({ name: 'Target', price: 10 });
      await AppointmentService.create({ name: 'Other', price: 20 });

      const result = await appointmentServiceService.list({ id: created.id });
      expect(result.length).toBe(1);
      expect(result[0].id).toBe(created.id);
    });
  });

  describe('getById', () => {
    it('should retrieve service by ID', async () => {
      const created = await AppointmentService.create({
        name: 'Test Service',
        price: 75
      });
      const result = await appointmentServiceService.getById(created.id);
      expect(result?.name).toBe('Test Service');
    });

    it('should return null for non-existent ID', async () => {
      const result = await appointmentServiceService.getById('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update service fields', async () => {
      const created = await AppointmentService.create({
        name: 'Original Name',
        price: 50
      });
      const result = await appointmentServiceService.update(created.id, {
        name: 'Updated Name',
        price: 75
      });
      expect(result?.name).toBe('Updated Name');
      expect(result?.price).toBe(75);
    });

    it('should return null when updating non-existent service', async () => {
      const result = await appointmentServiceService.update('non-existent-id', { name: 'New' });
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should soft delete service (set isRemove to true)', async () => {
      const created = await AppointmentService.create({
        name: 'Service to Remove',
        price: 50,
        isRemove: false
      });
      const result = await appointmentServiceService.remove(created.id);
      expect(result?.isRemove).toBe(true);

      const stillExists = await AppointmentService.findByPk(created.id);
      expect(stillExists).not.toBeNull();
    });

    it('should return null when removing non-existent service', async () => {
      const result = await appointmentServiceService.remove('non-existent-id');
      expect(result).toBeNull();
    });
  });
});
