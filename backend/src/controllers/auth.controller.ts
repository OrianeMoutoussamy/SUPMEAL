import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { AppError } from '../utils/app-error';
const signToken = (id: string, email: string) => jwt.sign({ email }, env.jwtSecret, { subject: id, expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] });
export async function register(req: Request, res: Response) {
  const existing = await prisma.user.findUnique({ where: { email: req.body.email.toLowerCase() } });
  if (existing) throw new AppError(409, 'Un compte utilise déjà cette adresse e-mail.');
  const user = await prisma.user.create({ data: { email: req.body.email.toLowerCase(), passwordHash: await bcrypt.hash(req.body.password, 12), displayName: req.body.displayName }, select: { id: true, email: true, displayName: true } });
  res.status(201).json({ success: true, data: { user, token: signToken(user.id, user.email) } });
}
export async function login(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ where: { email: req.body.email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) throw new AppError(401, 'Adresse e-mail ou mot de passe incorrect.');
  res.json({ success: true, data: { user: { id: user.id, email: user.email, displayName: user.displayName }, token: signToken(user.id, user.email) } });
}
