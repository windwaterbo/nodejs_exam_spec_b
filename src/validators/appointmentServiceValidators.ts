import Joi from 'joi';

export const createAppointmentServiceSchema = Joi.object({
  name: Joi.string().max(255).required(),
  description: Joi.string().allow('', null),
  price: Joi.number().integer().required(),
  showTime: Joi.number().integer().optional(),
  isPublic: Joi.boolean().optional()
});
