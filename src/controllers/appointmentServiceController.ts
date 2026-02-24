import { Context } from 'koa';
import appointmentServiceService from '../services/appointmentServiceService';

const list = async (ctx: Context) => {
  const query = ctx.request.query as any;
  // If any query params provided, honor filters; otherwise return all records
  const hasFilters = query && Object.keys(query).length > 0;
  const data = hasFilters ? await appointmentServiceService.list(query) : await appointmentServiceService.list();
  ctx.body = { data };
};

const create = async (ctx: Context) => {
  const payload = ctx.request.body as any;
  const created = await appointmentServiceService.create({ ...payload });
  ctx.body = { data: created };
};

const getById = async (ctx: Context) => {
  const { id } = ctx.params;
  const data = await appointmentServiceService.getById(id);
  ctx.body = { data };
};

const update = async (ctx: Context) => {
  const { id } = ctx.params;
  const updated = await appointmentServiceService.update(id, ctx.request.body as any);
  ctx.body = { data: updated };
};

const remove = async (ctx: Context) => {
  const { id } = ctx.params;
  await appointmentServiceService.remove(id);
  ctx.body = { data: { id } };
};

export default { list, create, getById, update, remove };
