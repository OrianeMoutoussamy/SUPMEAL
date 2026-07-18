#!/bin/sh
set -e
npx prisma migrate deploy
node dist/src/server.js
