# SUPMEAL Fullstack

Application fullstack de gestion de recettes et de planification de repas.

## Stack

- Frontend : React 19, TypeScript, Vite, React Router, Axios
- Backend : Node.js, TypeScript, Express REST, Joi, JWT, Prisma, Socket.IO, Swagger
- Database : PostgreSQL 16
- Deployment : Docker Compose

Le code, les noms de fichiers, variables, routes et modèles sont en anglais. Les messages d'erreur de l'API sont en français.

## Security choices

- Aucun secret n'est écrit dans le code source.
- `.env` est ignoré par Git.
- Les mots de passe sont hachés avec bcrypt (12 rounds).
- Les entrées sont validées avec Joi.
- Les routes privées utilisent JWT.
- Les permissions des cookbooks sont contrôlées côté serveur.
- Les erreurs Prisma, 400, 401, 403, 404, 409 et 500 sont transformées en réponses JSON explicites.
- CORS n'autorise que l'URL frontend définie dans `.env`.
- L'en-tête `X-Powered-By` d'Express est désactivé.

## Start with Docker

1. Modifie les secrets de `.env` avant le premier lancement.
2. Lance :

```bash
docker compose up --build
```

Services :

- Frontend : http://localhost:5173
- Backend : http://localhost:4000/api
- Swagger : http://localhost:4000/api/docs
- PostgreSQL : localhost:5432

## Local development

Backend :

```bash
cd backend
npm install
npm run prisma:generate
npm run dev
```

Frontend :

```bash
cd frontend
npm install
npm run dev
```

Pour un lancement local sans Docker du backend, remplace l'hôte `database` par `localhost` dans `DATABASE_URL`.

## Main REST endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET/PATCH /api/users/me`
- CRUD `/api/cookbooks`
- `POST /api/cookbooks/:id/members`
- CRUD `/api/recipes`
- `POST /api/recipes/:id/favorite`
- `POST /api/recipes/:id/comments`
- `GET/POST/DELETE /api/meal-plans`
- `GET /api/data/export`
- `POST /api/data/import`

## Realtime messaging

Socket.IO events:

- Client: `cookbook:join`
- Client: `message:send`
- Server: `message:created`

The JWT must be sent through `socket.auth.token`.
