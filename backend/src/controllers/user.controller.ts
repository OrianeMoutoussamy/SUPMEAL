import { Request, Response } from 'express';
import { prisma } from '../config/database';
export async function getProfile(req: Request, res: Response) { const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.id }, select: { id:true,email:true,displayName:true,dietaryPreferences:true,allergies:true,favoriteCuisines:true,defaultServings:true,createdAt:true } }); res.json({ success:true,data:user }); }
export async function updateProfile(req: Request, res: Response) { const user = await prisma.user.update({ where:{id:req.user!.id},data:req.body,select:{id:true,email:true,displayName:true,dietaryPreferences:true,allergies:true,favoriteCuisines:true,defaultServings:true} }); res.json({success:true,data:user}); }
