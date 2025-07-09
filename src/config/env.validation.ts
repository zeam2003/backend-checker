import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  MONGODB_URI: Joi.string().uri().required(),
  GLPI_APP_TOKEN: Joi.string().required(),
  API_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().required(),
});
