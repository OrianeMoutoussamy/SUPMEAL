FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src
RUN npm run build


FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/dist ./dist

COPY prisma ./prisma

COPY docker-entrypoint.sh /app/docker-entrypoint.sh

RUN sed -i 's/\r$//' /app/docker-entrypoint.sh \
    && chmod +x /app/docker-entrypoint.sh \
    && mkdir -p /app/uploads

EXPOSE 4000

CMD ["sh", "/app/docker-entrypoint.sh"]