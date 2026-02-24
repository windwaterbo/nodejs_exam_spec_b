import { Context, Next } from 'koa';

export const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err: any) {
    console.error('❌ Error:', err);
    const code = err.code || 'INTERNAL_ERROR';
    const message = err.message || 'Internal server error';
    ctx.status = err.status || 400;
    ctx.body = { error: { code, message } };
  }
};
