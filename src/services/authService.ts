import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';
import userRepository from '../repositories/userRepository';

const register = async (payload: { email: string; password: string; name: string }) => {
  const existing = await userRepository.findByEmail(payload.email);
  if (existing) {
    const err: any = new Error('Email already in use');
    err.code = 'EMAIL_TAKEN';
    throw err;
  }
  const hashed = await bcrypt.hash(payload.password, 10);
  const user = await userRepository.createUser({ email: payload.email, password: hashed, name: payload.name });
  return { id: user.id, email: user.email, name: user.name };
};

const login = async (payload: { email: string; password: string }) => {
  const user = await userRepository.findByEmail(payload.email);
  if (!user) {
    const err: any = new Error('Invalid credentials');
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }
  const valid = await bcrypt.compare(payload.password, user.password);
  if (!valid) {
    const err: any = new Error('Invalid credentials');
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }
  const token = jwt.sign({ sub: user.id, email: user.email }, config.jwtSecret, { expiresIn: '1h' });
  return { token };
};

export default { register, login };
