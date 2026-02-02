import * as Joi from 'joi';

export default Joi.object({
  PORT: Joi.number().default(3000),
  DATABASE_HOST: Joi.string().optional(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USER: Joi.string().optional(),
  DATABASE_PASSWORD: Joi.string().optional(),
  DATABASE_NAME: Joi.string().optional(),
  DATABASE_AUTOLOAD_ENTITIES: Joi.boolean().default(true),
  DATABASE_SYNC: Joi.boolean().default(true),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  DATABASE_URL: Joi.string().uri().required(),
});
