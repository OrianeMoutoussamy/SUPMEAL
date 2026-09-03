import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/app-error';
export const validate = (schema: Joi.ObjectSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const { value, error } = schema.validate({ body: req.body, params: req.params, query: req.query }, { abortEarly: false, stripUnknown: true });
  if (error) return next(new AppError(400, 'Les données envoyées sont invalides.', error.details.map((d) => d.message)));

  Object.defineProperty(req, 'body', { value: value.body, configurable: true, writable: true, enumerable: true });
  Object.defineProperty(req, 'params', { value: value.params, configurable: true, writable: true, enumerable: true });
  Object.defineProperty(req, 'query', { value: value.query, configurable: true, writable: true, enumerable: true });

  next();
};
