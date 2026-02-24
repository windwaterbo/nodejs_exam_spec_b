import { Context } from 'koa';
import authService from '../services/authService';

const register = async (ctx: Context) => {
  const payload = ctx.request.body as any;
  const user = await authService.register(payload);
  ctx.body = { data: user };
};

const login = async (ctx: Context) => {
  const payload = ctx.request.body as any;
  const token = await authService.login(payload);
  ctx.body = { data: token };
};

export default { register, login };
