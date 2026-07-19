import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/app-error';

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(404, `La route ${req.method} ${req.originalUrl} est introuvable.`));
}

export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction): void {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, error);
  if (error instanceof AppError) { res.status(error.statusCode).json({ success: false, error: { message: error.message, details: error.details } }); return; }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const messages: Record<string, [number, string]> = { P2002: [409, 'Une ressource avec ces informations existe déjà.'], P2025: [404, 'La ressource demandée est introuvable.'], P2003: [409, 'Cette opération est impossible car la ressource est encore utilisée.'] };
    const mapped = messages[error.code] ?? [500, 'Une erreur de base de données est survenue.'];
    res.status(mapped[0]).json({ success: false, error: { message: mapped[1], code: error.code } }); return;
  }
  res.status(500).json({ success: false, error: { message: 'Une erreur interne inattendue est survenue.' } });
}
