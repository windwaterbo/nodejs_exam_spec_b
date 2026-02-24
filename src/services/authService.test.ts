import authService from './authService';
import userRepository from '../repositories/userRepository';
import User from '../models/user';

describe('authService', () => {
  describe('register', () => {
    it('should register a new user', async () => {
      const payload = {
        email: 'user1@test.com',
        password: 'password123',
        name: 'Test User'
      };
      const result = await authService.register(payload);
      expect(result.email).toBe(payload.email);
      expect(result.name).toBe(payload.name);
      expect(result).not.toHaveProperty('password');
    });

    it('should hash password before storing', async () => {
      const payload = {
        email: 'hash@test.com',
        password: 'password123',
        name: 'Hash User'
      };
      await authService.register(payload);
      const user = await userRepository.findByEmail(payload.email);
      expect(user?.password).not.toBe(payload.password);
    });

    it('should reject duplicate email', async () => {
      const payload = {
        email: 'duplicate@test.com',
        password: 'password123',
        name: 'User 1'
      };
      await authService.register(payload);
      await expect(authService.register(payload)).rejects.toThrow('Email already in use');
    });

    it('should support alphanumeric passwords with mixed case', async () => {
      const payload = {
        email: 'alphanumeric@test.com',
        password: 'Abc123XYZ',
        name: 'Alphanumeric User'
      };
      const result = await authService.register(payload);
      expect(result.email).toBe(payload.email);
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await User.destroy({ where: { email: 'login@test.com' } });
      await authService.register({
        email: 'login@test.com',
        password: 'password123',
        name: 'Login User'
      });
    });

    it('should return JWT token on valid credentials', async () => {
      const result = await authService.login({
        email: 'login@test.com',
        password: 'password123'
      });
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
    });

    it('should reject invalid email', async () => {
      await expect(
        authService.login({
          email: 'notfound@test.com',
          password: 'password123'
        })
      ).rejects.toThrow('Invalid credentials');
    });

    it('should reject invalid password', async () => {
      await expect(
        authService.login({
          email: 'login@test.com',
          password: 'wrongpassword'
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
