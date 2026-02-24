import { Context, Next } from 'koa';
import { ObjectSchema } from 'joi';

export const validateBody = (schema: ObjectSchema) => async (ctx: Context, next: Next) => {
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    const err: any = new Error(result.error.message);
    err.code = 'VALIDATION_ERROR';
    err.status = 400;
    throw err;
  }
  ctx.request.body = result.value;
  await next();
};
