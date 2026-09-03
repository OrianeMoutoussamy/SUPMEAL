# SUPMEAL

Projet : SUPMEAL  
Année : 2026  
Type : Sujet de rattrapage  
École : SUPINFO Tours  
Auteur : MOUTOUSSAMY Oriane  

## Sommaire

- [1. Contexte du projet](#1-contexte-du-projet)
- [2. Objectifs fonctionnels](#2-objectifs-fonctionnels)
- [3. Stack technique](#3-stack-technique)
- [4. Architecture globale](#4-architecture-globale)
- [5. Backend](#5-backend)
  - [5.1. Structure du backend](#51-structure-du-backend)
  - [5.2. Dépendances et rôle des bibliothèques](#52-dépendances-et-rôle-des-bibliothèques)
  - [5.3. Gestion des erreurs](#53-gestion-des-erreurs)
  - [5.4. Validation des entrées](#54-validation-des-entrées)
  - [5.5. Authentification et autorisations](#55-authentification-et-autorisations)
  - [5.6. API REST](#56-api-rest)
  - [5.7. Swagger](#57-swagger)
- [6. Frontend](#6-frontend)
  - [6.1. Setup et environnement](#61-setup-et-environnement)
  - [6.2. Pourquoi React + Vite ?](#62-pourquoi-react--vite-)
- [7. Base de données et schéma de données](#7-base-de-données-et-schéma-de-données)
- [8. Guide de démarrage](#8-guide-de-démarrage)
  - [8.1. Avec Docker Compose](#81-avec-docker-compose)
  - [8.2. En développement local](#82-en-développement-local)
- [9. Sécurité et configuration](#9-sécurité-et-configuration)
- [10. Points forts et limites du projet](#10-points-forts-et-limites-du-projet)
- [11. Note d'excuse sur le rendu incomplet](#11-note-dexcuse-sur-le-rendu-incomplet)

---

## 1. Contexte du projet

Le projet SUPMEAL vise à proposer une application de gestion de recettes, de cookbooks, de plans de repas et de partage de contenu entre utilisateurs.

Le but est de fournir une plateforme simple où l’utilisateur peut :

- créer et gérer des recettes,
- organiser des cookbooks,
- inviter d’autres utilisateurs,
- gérer des plans de repas,
- exporter/importer ses données,
- utiliser une API documentée et testable.

Ce projet a été réalisé dans le cadre d’un sujet de rattrapage, dans un contexte académique. Il a été pensé comme un MVP fonctionnel démontrant les bases d’une architecture backend/frontend moderne et cohérente.

---

## 2. Objectifs fonctionnels

Les objectifs principaux du projet sont les suivants :

- centraliser les recettes et les informations nutritionnelles de manière structurée,
- gérer des cookbooks avec accès par utilisateur,
- définir des rôles au sein d’un cookbook (OWNER, EDITOR, COMMENTER, READER),
- proposer un flux de création et de modification de recettes,
- gérer les favoris et les commentaires,
- organiser un planning de repas,
- exposer une API REST avec documentation Swagger,
- sécuriser l’application avec JWT et validation des entrées,
- permettre le démarrage sur Docker pour simplifier le déploiement local.

---

## 3. Stack technique

### Backend

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- JWT
- Joi
- Swagger UI / Swagger JSDoc
- Socket.IO

### Frontend

- React
- TypeScript
- Vite
- Nginx (dans le conteneur de production)

### Outils / environnement

- Docker Compose
- Git
- npm
- environnement variable `.env`

---

## 4. Architecture globale

Le projet suit une architecture logicielle simple et claire :

- le frontend est une application React qui consomme l’API backend,
- le backend expose des endpoints REST sécurisés,
- Prisma gère la couche de persistance vers PostgreSQL,
- Swagger sert de documentation interactive pour les routes,
- Docker Compose orchestre les différents services : base de données, backend et frontend.

L’architecture est pensée pour être facilement compréhensible en cours de projet, avec une séparation nette entre :

- contrôleurs,
- middlewares,
- routes,
- services,
- validation,
- configuration,
- accès base de données.

---

## 5. Backend

### 5.1. Structure du backend

Le backend est organisé de la manière suivante :

- `src/app.ts` : initialisation de l’application Express
- `src/server.ts` : démarrage du serveur HTTP
- `src/routes/index.ts` : définition de toutes les routes
- `src/controllers/` : logique métier exposée par les endpoints
- `src/middlewares/` : authentification, validation, gestion des erreurs
- `src/services/` : logique métier réutilisable
- `src/config/` : variables d’environnement, DB, Swagger
- `src/validators/schemas.ts` : schémas Joi
- `src/utils/` : classes utilitaires comme `AppError`
- `prisma/schema.prisma` : schéma de données Prisma

### 5.2. Dépendances et rôle des bibliothèques

- Express : framework HTTP permettant de gérer les routes et les middlewares.
- TypeScript : sécurisation du code, typage statique, meilleure maintenabilité.
- Prisma : abstraction de la base de données, migration et accès robuste aux données.
- PostgreSQL : base de données relationnelle pour stocker les utilisateurs, recettes, cookbooks et plans.
- Joi : validation des entrées utilisateur et des objets reçus en requête.
- JWT : authentification stateless entre client et API.
- Swagger UI / Swagger JSDoc : documentation interactive de l’API.
- Socket.IO : prises en charge de fonctionnalités temps réel si le projet devait évoluer.

### 5.3. Gestion des erreurs

La gestion des erreurs a été pensée pour rester claire et exploitable côté client.

Les erreurs sont centralisées via :

- `AppError` pour les erreurs métiers et applicatives,
- `error.middleware.ts` pour le traitement global,
- les exceptions Prisma converties en réponses HTTP explicites,
- les validations Joi renvoyant des erreurs 400 lisibles.

Exemples de gestion :

- 400 : données invalides,
- 401 : non authentifié,
- 403 : permission refusée,
- 404 : ressource introuvable,
- 409 : conflit ou duplication,
- 500 : erreur interne.

Cette approche est utile pour la documentation technique car elle standardise le comportement de l’API et facilite le debugging.

### 5.4. Validation des entrées

Les données reçues sont validées grâce à Joi. Cela évite les erreurs côté serveur, protège l’API et simplifie le contrôle des formulaires.

Les schémas couvrent notamment :

- inscription/login,
- recettes,
- cookbooks,
- membres,
- plans de repas,
- profils utilisateurs,
- identifiants UUID.

Le middleware `validate` reçoit le body, params et query, effectue la validation et nettoie les données avant continuation de la requête.

### 5.5. Authentification et autorisations

L’authentification se base sur JWT.

Lors de l’inscription ou de la connexion, le backend envoie un token. Celui-ci est ensuite utilisé dans l’Authorization header au format :

`Bearer <token>`

Les routes protégées passent par le middleware `authenticate`, puis les accès à certains cookbooks ou recettes sont contrôlés par `requireCookbookRole`.

Cela permet d’appliquer un modèle d’autorisations cohérent :

- propriétaire,
- éditeur,
- commentaire,
- lecteur.

### 5.6. API REST

L’API REST expose les ressources suivantes :

- Authentification
  - `POST /api/auth/register`
  - `POST /api/auth/login`

- Utilisateur
  - `GET /api/users/me`
  - `PATCH /api/users/me`

- Cookbooks
  - `GET /api/cookbooks`
  - `POST /api/cookbooks`
  - `GET /api/cookbooks/:id`
  - `PATCH /api/cookbooks/:id`
  - `DELETE /api/cookbooks/:id`
  - `POST /api/cookbooks/:id/members`

- Recettes
  - `GET /api/recipes`
  - `POST /api/recipes`
  - `GET /api/recipes/:id`
  - `PATCH /api/recipes/:id`
  - `DELETE /api/recipes/:id`
  - `POST /api/recipes/:id/favorite`
  - `POST /api/recipes/:id/comments`

- Meal plans
  - `GET /api/meal-plans`
  - `POST /api/meal-plans`
  - `DELETE /api/meal-plans/:id`

- Données
  - `GET /api/data/export`
  - `POST /api/data/import`

- Health
  - `GET /api/health`

### 5.7. Swagger

Swagger a été mis en place pour documenter l’API de manière visuelle et exploitable.

L’URL de documentation est la suivante :

- `http://localhost:4000/api/docs/`

Cela permet :

- de voir les endpoints,
- de tester les requêtes HTTP,
- d’avoir une documentation technique directement exploitable,
- de mieux expliquer le projet à des examinateurs ou évaluateurs.

Dans le projet, la configuration Swagger est dans :

- `backend/src/config/swagger.ts`

Le document contient les informations de base sur l’API, sa version, ses routes, et les composants de sécurité JWT.

---

## 6. Frontend

### 6.1. Setup et environnement

Le frontend est un projet React + TypeScript basé sur Vite.

Le setup comprend :

- `frontend/src/App.tsx` comme point d’entrée principal,
- configuration Vite pour le développement,
- Nginx pour servir la version produite dans Docker,
- variables d’environnement `VITE_API_URL` et `VITE_SOCKET_URL`.

### 6.2. Pourquoi React + Vite ?

Ces technologies ont été choisies pour plusieurs raisons :

- elles sont très largement utilisées dans les projets web modernes,
- elles sont cohérentes avec les enseignements de cours sur les interfaces utilisateur dynamiques,
- elles permettent un développement rapide avec une structure claire,
- Vite offre un environnement de développement très réactif,
- React est bien adapté à une architecture modulable avec composants et états.

Dans le cadre du projet, le frontend est pensé comme une couche de consommation de l’API backend, avec des interactions simples et des données affichées dynamiquement.

---

## 7. Base de données et schéma de données

La base de données est PostgreSQL, gérée via Prisma.

### Modèles principaux

- `User`
  - id
  - email
  - passwordHash
  - displayName
  - dietaryPreferences
  - allergies
  - favoriteCuisines
  - defaultServings
  - createdAt
  - updatedAt

- `Cookbook`
  - id
  - name
  - description
  - ownerId
  - createdAt
  - updatedAt

- `CookbookMember`
  - id
  - cookbookId
  - userId
  - role

- `Recipe`
  - id
  - title
  - description
  - preparationMinutes
  - cookingMinutes
  - servings
  - imageUrl
  - sourceUrl
  - ingredients
  - steps
  - tags
  - authorId
  - cookbookId

- `Comment`
  - id
  - content
  - recipeId
  - authorId

- `Favorite`
  - id
  - userId
  - recipeId

- `MealPlan`
  - id
  - plannedFor
  - mealType
  - servings
  - notes
  - recipeId
  - userId
  - cookbookId

### Relations

- un utilisateur peut posséder plusieurs cookbooks,
- un utilisateur peut rejoindre plusieurs cookbooks en tant que membre,
- une recette appartient à un auteur et éventuellement à un cookbook,
- les commentaires, favoris et plans de repas sont liés à des utilisateurs et à des recettes,
- les permissions sont gérées par l’enum `CookbookRole` : OWNER, EDITOR, COMMENTER, READER.

Ce schéma est cohérent avec les besoins du projet et permet une bonne extensibilité pour de futures fonctionnalités.

---

## 8. Guide de démarrage

### 8.1. Avec Docker Compose

Depuis la racine du projet :

```bash
docker compose up --build
```

Ensuite :

- Frontend : http://localhost:5173
- Backend : http://localhost:4000/api
- Swagger : http://localhost:4000/api/docs/
- PostgreSQL : localhost:5432

### 8.2. En développement local

Backend :

```bash
cd backend
npm install
npx prisma generate
npm run dev
```

Frontend :

```bash
cd frontend
npm install
npm run dev
```

Il faut penser à configurer les variables d’environnement dans un fichier `.env` à la racine du projet. Les principales variables sont :

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `BACKEND_PORT`
- `FRONTEND_PORT`
- `FRONTEND_URL`
- `VITE_API_URL`
- `VITE_SOCKET_URL`

---

## 9. Sécurité et configuration

Les points de sécurité les plus importants sont :

- aucun secret n’est codé en dur dans le code source,
- les mots de passe sont hachés avec bcrypt,
- l’API vérifie les tokens JWT,
- les routes sécurisées imposent une authentification,
- la validation Joi protège l’application contre des entrées mal formées,
- CORS est limité à l’URL du frontend configurée,
- l’option `x-powered-by` est désactivée.

Le fichier `.env` est donc un élément fondamental pour le bon fonctionnement du projet, surtout en environnement Docker.

---

## 10. Points forts et limites du projet

### Points forts

- architecture backend claire et structurée,
- API REST cohérente et documentée,
- usage de Prisma pour l’accès base de données,
- validation forte des entrées,
- sécurité JWT,
- dockerisation du projet,
- Swagger facilitant la démonstration technique.

### Limites

Le projet est fonctionnel et testable sur les fonctionnalités principales, mais il reste incomplet selon les ambitions d’un projet plus complet.

Certaines limites sont notamment :

- l’interface frontend reste simple et centrée sur les besoins de démonstration,
- certaines évolutions visuelles ouUX ne sont pas complètes,
- le projet a été réalisé dans un cadre de rattrapage, avec des contraintes de temps et de priorité sur les éléments essentiels.

---

## 11. Note d'excuse sur le rendu incomplet

Contexte du rendu : Ce projet a été réalisé dans le cadre d’un sujet de rattrapage. Étant actuellement
en arrêt, je n’ai malheureusement pas réussi à terminer l’ensemble du projet dans le temps imparti.
J’ai pu terminer la partie backend, qui est fonctionnelle, avec notamment la base de données,
l’authentification, la gestion des différentes routes et leur documentation avec Swagger.
J’avais également commencé le frontend, mais je n’ai pas eu suffisamment de temps pour le terminer
correctement. La version obtenue nécessitait encore du travail et certaines corrections, notamment au
niveau de la sécurité. Je ne souhaitais pas rendre un frontend fait rapidement, avec des failles importantes
qui auraient pu pénaliser davantage le projet.
J’ai donc préféré rendre uniquement le backend fonctionnel et documenté, plutôt que d’ajouter un frontend
incomplet ou mal sécurisé simplement pour avoir une interface à présenter.
Le projet a cependant déjà été préparé pour accueillir le frontend : la structure, la configuration et les
éléments nécessaires à son intégration sont présents. Celui-ci pourra donc être ajouté par la suite sans
avoir à reprendre entièrement la partie backend.
Le rendu reste donc incomplet puisqu’il manque l’interface utilisateur, mais la partie technique côté
backend est fonctionnelle et peut être testée directement grâce à Swagger.

