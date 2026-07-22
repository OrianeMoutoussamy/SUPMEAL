import { CookbookRole } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../utils/app-error';
const levels: Record<CookbookRole, number> = { OWNER: 4, EDITOR: 3, COMMENTER: 2, READER: 1 };
export async function requireCookbookRole(cookbookId: string, userId: string, minimum: CookbookRole) {
  const cookbook = await prisma.cookbook.findUnique({ where: { id: cookbookId }, include: { members: true } });
  if (!cookbook) throw new AppError(404, 'Le livre de recettes est introuvable.');
  const role: CookbookRole | undefined = cookbook.ownerId === userId ? 'OWNER' : cookbook.members.find((m) => m.userId === userId)?.role;
  if (!role || levels[role] < levels[minimum]) throw new AppError(403, "Vous n'avez pas la permission nécessaire.");
  return { cookbook, role };
}
