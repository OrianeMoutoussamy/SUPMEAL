import { Request, Response } from 'express';

import { prisma } from '../config/database';

type MealPlanParams = {
    id: string;
};

export async function listMealPlans(req: Request, res: Response) {
    const items = await prisma.mealPlan.findMany({
        where: {
            userId: req.user!.id,
        },
        include: {
            recipe: true,
        },
        orderBy: {
            plannedFor: 'asc',
        },
    });

    res.json({
        success: true,
        data: items,
    });
}

export async function createMealPlan(req: Request, res: Response) {
    const item = await prisma.mealPlan.create({
        data: {
            ...req.body,
            plannedFor: new Date(req.body.plannedFor),
            userId: req.user!.id,
        },
        include: {
            recipe: true,
        },
    });

    res.status(201).json({
        success: true,
        data: item,
    });
}

export async function deleteMealPlan(
    req: Request<MealPlanParams>,
    res: Response
) {
    const { id } = req.params;

    await prisma.mealPlan.delete({
        where: {
            id,
            userId: req.user!.id,
        },
    });

    res.status(204).send();
}