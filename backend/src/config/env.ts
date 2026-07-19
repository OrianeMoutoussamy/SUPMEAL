import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  DATABASE_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  BACKEND_PORT: Joi.number().port().default(4000),
  FRONTEND_URL: Joi.string().uri().required(),
}).unknown(true);

const { value, error } = schema.validate(process.env, { abortEarly: false });
if (error) throw new Error(`Configuration invalide : ${error.message}`);

export const env = {
  nodeEnv: value.NODE_ENV as string,
  databaseUrl: value.DATABASE_URL as string,
  jwtSecret: value.JWT_SECRET as string,
  jwtExpiresIn: value.JWT_EXPIRES_IN as string,
  port: Number(value.BACKEND_PORT),
  frontendUrl: value.FRONTEND_URL as string,
};
