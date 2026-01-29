import * as Joi from 'joi';

export default Joi.object({
  PORT: Joi.number().default(3000),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_AUTOLOAD_ENTITIES: Joi.boolean().default(true),
  DATABASE_SYNC: Joi.boolean().default(true),
});
