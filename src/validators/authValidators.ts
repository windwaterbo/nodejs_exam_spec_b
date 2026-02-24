import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().max(255).email().required(),
  password: Joi.string()
    .min(6)
    .max(36)
    .pattern(/^[a-zA-Z0-9]+$/)
    .required()
    .messages({
      'string.max': 'Password 最多支援 36 個字元',
      'string.pattern.base': 'Password 只支援大小寫英文與數字混合，不能有特殊符號',
      'string.min': 'Password 至少需要 6 個字元'
    }),
  name: Joi.string().max(255).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
