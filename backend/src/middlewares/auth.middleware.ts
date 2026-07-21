import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/app-error';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next(new AppError(401, "Jeton d'authentification manquant."));
  try {
    const payload = jwt.verify(header.slice(7), env.jwtSecret) as { sub: string; email: string };
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    next(new AppError(401, "Jeton d'authentification invalide ou expiré."));
  }
}
