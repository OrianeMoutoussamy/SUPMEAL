import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { getProfile, updateProfile } from '../controllers/user.controller';
import * as cookbook from '../controllers/cookbook.controller';
import * as recipe from '../controllers/recipe.controller';
import * as meal from '../controllers/meal-plan.controller';
import * as data from '../controllers/data.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { asyncHandler } from '../utils/async-handler';
import { registerSchema, loginSchema, profileSchema, cookbookSchema, cookbookUpdateSchema, memberSchema, recipeSchema, recipeUpdateSchema, idSchema, commentSchema, mealPlanSchema } from '../validators/schemas';
const r = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Vérifie l'état de l'API
 *     responses:
 *       200:
 *         description: API disponible
 */
r.get('/health', (_q, s) => s.json({ success: true, data: { status: 'ok' } }));

/**
* @openapi
* /api/auth/register:
*   post:
*     tags: [Auth]
*     summary: Création d'un compte utilisateur
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required: [email, password, displayName]
*             properties:
*               email:
*                 type: string
*                 format: email
*               password:
*                 type: string
*                 format: password
*               displayName:
*                 type: string
*     responses:
*       201:
*         description: Compte créé
*       400:
*         description: Données invalides
*/
r.post('/auth/register', validate(registerSchema), asyncHandler(register));

/**
* @openapi
* /api/auth/login:
*   post:
*     tags: [Auth]
*     summary: Connexion utilisateur
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required: [email, password]
*             properties:
*               email:
*                 type: string
*                 format: email
*               password:
*                 type: string
*                 format: password
*     responses:
*       200:
*         description: Connexion réussie
*       401:
*         description: Identifiants invalides
*/
r.post('/auth/login', validate(loginSchema), asyncHandler(login));

r.use(authenticate);

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Récupère le profil de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *   patch:
 *     tags: [Users]
 *     summary: Met à jour le profil de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil mis à jour
 */
r.get('/users/me', asyncHandler(getProfile)); r.patch('/users/me', validate(profileSchema), asyncHandler(updateProfile));

/**
* @openapi
* /api/cookbooks:
*   get:
*     tags: [Cookbooks]
*     summary: Liste des cookbooks
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Liste des cookbooks
*   post:
*     tags: [Cookbooks]
*     summary: Crée un cookbook
*     security:
*       - bearerAuth: []
*     responses:
*       201:
*         description: Cookbook créé
*/
r.get('/cookbooks', asyncHandler(cookbook.listCookbooks)); r.post('/cookbooks', validate(cookbookSchema), asyncHandler(cookbook.createCookbook));

/**
* @openapi
* /api/cookbooks/{id}:
*   get:
*     tags: [Cookbooks]
*     summary: Détail d'un cookbook
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: Cookbook trouvé
*   patch:
*     tags: [Cookbooks]
*     summary: Met à jour un cookbook
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Cookbook mis à jour
*   delete:
*     tags: [Cookbooks]
*     summary: Supprime un cookbook
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Cookbook supprimé
*/
r.get('/cookbooks/:id', validate(idSchema), asyncHandler(cookbook.getCookbook)); r.patch('/cookbooks/:id', validate(cookbookUpdateSchema), asyncHandler(cookbook.updateCookbook)); r.delete('/cookbooks/:id', validate(idSchema), asyncHandler(cookbook.deleteCookbook));

/**
* @openapi
* /api/cookbooks/{id}/members:
*   post:
*     tags: [Cookbooks]
*     summary: Ajoute un membre à un cookbook
*     security:
*       - bearerAuth: []
*     responses:
*       201:
*         description: Membre ajouté
*/
r.post('/cookbooks/:id/members', validate(memberSchema), asyncHandler(cookbook.addMember));

/**
* @openapi
* /api/recipes:
*   get:
*     tags: [Recipes]
*     summary: Liste des recettes
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Liste des recettes
*   post:
*     tags: [Recipes]
*     summary: Crée une recette
*     security:
*       - bearerAuth: []
*     responses:
*       201:
*         description: Recette créée
*/
r.get('/recipes', asyncHandler(recipe.listRecipes)); r.post('/recipes', validate(recipeSchema), asyncHandler(recipe.createRecipe));

/**
* @openapi
* /api/recipes/{id}:
*   get:
*     tags: [Recipes]
*     summary: Récupère une recette
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Recette trouvée
*   patch:
*     tags: [Recipes]
*     summary: Met à jour une recette
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Recette mise à jour
*   delete:
*     tags: [Recipes]
*     summary: Supprime une recette
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Recette supprimée
*/
r.get('/recipes/:id', validate(idSchema), asyncHandler(recipe.getRecipe)); r.patch('/recipes/:id', validate(recipeUpdateSchema), asyncHandler(recipe.updateRecipe)); r.delete('/recipes/:id', validate(idSchema), asyncHandler(recipe.deleteRecipe));

/**
* @openapi
* /api/recipes/{id}/favorite:
*   post:
*     tags: [Recipes]
*     summary: Ajoute ou retire une recette des favoris
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Favori mis à jour
*/
r.post('/recipes/:id/favorite', validate(idSchema), asyncHandler(recipe.toggleFavorite));

/**
* @openapi
* /api/recipes/{id}/comments:
*   post:
*     tags: [Recipes]
*     summary: Ajoute un commentaire sur une recette
*     security:
*       - bearerAuth: []
*     responses:
*       201:
*         description: Commentaire ajouté
*/
r.post('/recipes/:id/comments', validate(commentSchema), asyncHandler(recipe.addComment));

/**
* @openapi
* /api/meal-plans:
*   get:
*     tags: [MealPlans]
*     summary: Liste des plans de repas
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Liste des plans de repas
*   post:
*     tags: [MealPlans]
*     summary: Crée un plan de repas
*     security:
*       - bearerAuth: []
*     responses:
*       201:
*         description: Plan de repas créé
*/
r.get('/meal-plans', asyncHandler(meal.listMealPlans)); r.post('/meal-plans', validate(mealPlanSchema), asyncHandler(meal.createMealPlan));

/**
* @openapi
* /api/meal-plans/{id}:
*   delete:
*     tags: [MealPlans]
*     summary: Supprime un plan de repas
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Plan de repas supprimé
*/
r.delete('/meal-plans/:id', validate(idSchema), asyncHandler(meal.deleteMealPlan));

/**
* @openapi
* /api/data/export:
*   get:
*     tags: [Data]
*     summary: Exporte les données de l'utilisateur connecté
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Fichier JSON exporté
*/
r.get('/data/export', asyncHandler(data.exportData));

/**
* @openapi
* /api/data/import:
*   post:
*     tags: [Data]
*     summary: Importe des données JSON
*     security:
*       - bearerAuth: []
*     responses:
*       201:
*         description: Import terminé
*/
r.post('/data/import', asyncHandler(data.importData));

export default r;
