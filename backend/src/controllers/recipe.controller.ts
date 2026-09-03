import { Request, Response } from 'express';

import { prisma } from '../config/database';
import { AppError } from '../utils/app-error';
import { requireCookbookRole } from '../services/access.service';

async function requireRecipeEdit(id: string, userId: string) {
    const recipe = await prisma.recipe.findUnique({
        where: {
            id,
        },
    });

    if (!recipe) {
        throw new AppError(
            404,
            'La recette est introuvable.'
        );
    }

    if (recipe.authorId !== userId) {
        if (!recipe.cookbookId) {
            throw new AppError(
                403,
                'Vous ne pouvez pas modifier cette recette.'
            );
        }

        await requireCookbookRole(
            recipe.cookbookId,
            userId,
            'EDITOR'
        );
    }

    return recipe;
}

export async function listRecipes(req: Request, res: Response) {
    const {
        search,
        cookbookId,
        tag,
        favorite,
    } = req.query as Record<string, string>;

    const items = await prisma.recipe.findMany({
        where: {
            AND: [
                cookbookId
                    ? {
                        cookbookId,
                    }
                    : {},

                tag
                    ? {
                        tags: {
                            has: tag,
                        },
                    }
                    : {},

                search
                    ? {
                        OR: [
                            {
                                title: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                description: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                tags: {
                                    has: search,
                                },
                            },
                        ],
                    }
                    : {},

                favorite === 'true'
                    ? {
                        favorites: {
                            some: {
                                userId: req.user!.id,
                            },
                        },
                    }
                    : {},

                {
                    OR: [
                        {
                            authorId: req.user!.id,
                        },
                        {
                            cookbook: {
                                OR: [
                                    {
                                        ownerId: req.user!.id,
                                    },
                                    {
                                        members: {
                                            some: {
                                                userId: req.user!.id,
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            ],
        },
        include: {
            favorites: {
                where: {
                    userId: req.user!.id,
                },
            },
            _count: {
                select: {
                    comments: true,
                },
            },
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });

    const data = items.map(({ favorites, ...recipe }: typeof items[number]) => ({
        ...recipe,
        isFavorite: favorites.length > 0,
    }));

    res.json({
        success: true,
        data,
    });
}

export async function getRecipe(req: Request, res: Response) {
    const id = String(req.params.id);

    const item = await prisma.recipe.findUnique({
        where: {
            id,
        },
        include: {
            author: {
                select: {
                    id: true,
                    displayName: true,
                },
            },
            comments: {
                include: {
                    author: {
                        select: {
                            id: true,
                            displayName: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            },
            favorites: {
                where: {
                    userId: req.user!.id,
                },
            },
        },
    });

    if (!item) {
        throw new AppError(
            404,
            'La recette est introuvable.'
        );
    }

    if (
        item.authorId !== req.user!.id &&
        item.cookbookId
    ) {
        await requireCookbookRole(
            item.cookbookId,
            req.user!.id,
            'READER'
        );
    } else if (item.authorId !== req.user!.id) {
        throw new AppError(
            403,
            "Vous n'avez pas accès à cette recette."
        );
    }

    const { favorites, ...recipe } = item;

    res.json({
        success: true,
        data: {
            ...recipe,
            isFavorite: favorites.length > 0,
        },
    });
}

export async function createRecipe(req: Request, res: Response) {
    if (req.body.cookbookId) {
        await requireCookbookRole(
            req.body.cookbookId,
            req.user!.id,
            'EDITOR'
        );
    }

    const item = await prisma.recipe.create({
        data: {
            ...req.body,
            authorId: req.user!.id,
        },
    });

    res.status(201).json({
        success: true,
        data: item,
    });
}

export async function updateRecipe(req: Request, res: Response) {
    const id = String(req.params.id);

    await requireRecipeEdit(
        id,
        req.user!.id
    );

    const item = await prisma.recipe.update({
        where: {
            id,
        },
        data: req.body,
    });

    res.json({
        success: true,
        data: item,
    });
}

export async function deleteRecipe(req: Request, res: Response) {
    const id = String(req.params.id);

    await requireRecipeEdit(
        id,
        req.user!.id
    );

    await prisma.recipe.delete({
        where: {
            id,
        },
    });

    res.status(204).send();
}

export async function toggleFavorite(req: Request, res: Response) {
    const id = String(req.params.id);

    const where = {
        userId_recipeId: {
            userId: req.user!.id,
            recipeId: id,
        },
    };

    const existing = await prisma.favorite.findUnique({
        where,
    });

    if (existing) {
        await prisma.favorite.delete({
            where,
        });

        res.json({
            success: true,
            data: {
                isFavorite: false,
            },
        });

        return;
    }

    await prisma.favorite.create({
        data: {
            userId: req.user!.id,
            recipeId: id,
        },
    });

    res.status(201).json({
        success: true,
        data: {
            isFavorite: true,
        },
    });
}

export async function addComment(req: Request, res: Response) {
    const id = String(req.params.id);

    const recipe = await prisma.recipe.findUnique({
        where: {
            id,
        },
    });

    if (!recipe) {
        throw new AppError(
            404,
            'La recette est introuvable.'
        );
    }

    if (recipe.cookbookId) {
        await requireCookbookRole(
            recipe.cookbookId,
            req.user!.id,
            'COMMENTER'
        );
    } else if (recipe.authorId !== req.user!.id) {
        throw new AppError(
            403,
            'Vous ne pouvez pas commenter cette recette.'
        );
    }

    const comment = await prisma.comment.create({
        data: {
            content: req.body.content,
            recipeId: recipe.id,
            authorId: req.user!.id,
        },
        include: {
            author: {
                select: {
                    id: true,
                    displayName: true,
                },
            },
        },
    });

    res.status(201).json({
        success: true,
        data: comment,
    });
}