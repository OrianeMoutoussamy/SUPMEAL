const apiBaseUrl = `http://localhost:${Number(process.env.BACKEND_PORT ?? 4000)}`;

export const swaggerDocument = {
    openapi: '3.0.3',
    info: {
        title: 'SUPMEAL API',
        version: '1.0.0',
        description: 'API REST de gestion de recettes, cookbooks, planning et messagerie.',
    },
    servers: [{ url: `${apiBaseUrl}/api` }],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    paths: {
        '/health': {
            get: {
                tags: ['Health'],
                summary: "Vérifie l'état de l'API",
                responses: {
                    200: { description: 'API disponible' },
                },
            },
        },
        '/auth/register': {
            post: {
                tags: ['Auth'],
                summary: "Création d'un compte utilisateur",
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password', 'displayName'],
                                properties: {
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string', format: 'password' },
                                    displayName: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: { 201: { description: 'Compte créé' }, 400: { description: 'Données invalides' } },
            },
        },
        '/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Connexion utilisateur',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string', format: 'password' },
                                },
                            },
                        },
                    },
                },
                responses: { 200: { description: 'Connexion réussie' }, 401: { description: 'Identifiants invalides' } },
            },
        },
        '/users/me': {
            get: {
                tags: ['Users'],
                summary: "Récupère le profil de l'utilisateur connecté",
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Profil utilisateur' } },
            },
            patch: {
                tags: ['Users'],
                summary: "Met à jour le profil de l'utilisateur connecté",
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Profil mis à jour' } },
            },
        },
        '/cookbooks': {
            get: {
                tags: ['Cookbooks'],
                summary: 'Liste des cookbooks',
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Liste des cookbooks' } },
            },
            post: {
                tags: ['Cookbooks'],
                summary: 'Crée un cookbook',
                security: [{ bearerAuth: [] }],
                responses: { 201: { description: 'Cookbook créé' } },
            },
        },
        '/cookbooks/{id}': {
            get: {
                tags: ['Cookbooks'],
                summary: "Détail d'un cookbook",
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Cookbook trouvé' } },
            },
            patch: {
                tags: ['Cookbooks'],
                summary: 'Met à jour un cookbook',
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Cookbook mis à jour' } },
            },
            delete: {
                tags: ['Cookbooks'],
                summary: 'Supprime un cookbook',
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Cookbook supprimé' } },
            },
        },
        '/cookbooks/{id}/members': {
            post: {
                tags: ['Cookbooks'],
                summary: 'Ajoute un membre à un cookbook',
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                responses: { 201: { description: 'Membre ajouté' } },
            },
        },
        '/recipes': {
            get: {
                tags: ['Recipes'],
                summary: 'Liste des recettes',
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Liste des recettes' } },
            },
            post: {
                tags: ['Recipes'],
                summary: 'Crée une recette',
                security: [{ bearerAuth: [] }],
                responses: { 201: { description: 'Recette créée' } },
            },
        },
        '/recipes/{id}': {
            get: {
                tags: ['Recipes'],
                summary: 'Récupère une recette',
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Recette trouvée' } },
            },
            patch: {
                tags: ['Recipes'],
                summary: 'Met à jour une recette',
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Recette mise à jour' } },
            },
            delete: {
                tags: ['Recipes'],
                summary: 'Supprime une recette',
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Recette supprimée' } },
            },
        },
        '/recipes/{id}/favorite': {
            post: {
                tags: ['Recipes'],
                summary: 'Ajoute ou retire une recette des favoris',
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Favori mis à jour' } },
            },
        },
        '/recipes/{id}/comments': {
            post: {
                tags: ['Recipes'],
                summary: 'Ajoute un commentaire sur une recette',
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                responses: { 201: { description: 'Commentaire ajouté' } },
            },
        },
        '/meal-plans': {
            get: {
                tags: ['MealPlans'],
                summary: 'Liste des plans de repas',
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Liste des plans de repas' } },
            },
            post: {
                tags: ['MealPlans'],
                summary: 'Crée un plan de repas',
                security: [{ bearerAuth: [] }],
                responses: { 201: { description: 'Plan de repas créé' } },
            },
        },
        '/meal-plans/{id}': {
            delete: {
                tags: ['MealPlans'],
                summary: 'Supprime un plan de repas',
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Plan de repas supprimé' } },
            },
        },
        '/data/export': {
            get: {
                tags: ['Data'],
                summary: "Exporte les données de l'utilisateur connecté",
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Fichier JSON exporté' } },
            },
        },
        '/data/import': {
            post: {
                tags: ['Data'],
                summary: 'Importe des données JSON',
                security: [{ bearerAuth: [] }],
                responses: { 201: { description: 'Import terminé' } },
            },
        },
    },
};
