import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  APP_PORT: Joi.number().default(3000).required(),

  STAGE: Joi.string().required(),

  DB_TYPE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432).required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION_TIME: Joi.number().default(3600).required(),
});
