import jwt from 'jsonwebtoken';
import config from '../config';
import { Context, Next } from 'koa';

export const authRequired = async (ctx: Context, next: Next) => {
  const header = ctx.headers.authorization;
  if (!header) {
    const err: any = new Error('Authorization header missing');
    err.code = 'NO_AUTH_HEADER';
    err.status = 401;
    throw err;
  }
  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    const err: any = new Error('Invalid authorization format');
    err.code = 'INVALID_AUTH_FORMAT';
    err.status = 401;
    throw err;
  }
  const token = parts[1];
  try {
    const payload: any = jwt.verify(token, config.jwtSecret);
    ctx.state.user = payload;
    await next();
  } catch (e) {
    const err: any = new Error('Invalid token');
    err.code = 'INVALID_TOKEN';
    err.status = 401;
    throw err;
  }
};
