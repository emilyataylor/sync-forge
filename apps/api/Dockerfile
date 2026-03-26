FROM node:20-alpine AS builder
WORKDIR /repo

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/types/package*.json ./packages/types/

RUN npm install

COPY apps/api ./apps/api
COPY packages/types ./packages/types

WORKDIR /repo/apps/api
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY apps/api/package*.json ./
RUN npm install --production
COPY --from=builder /repo/apps/api/dist ./dist
EXPOSE 3000
CMD [ "node", "dist/index.js" ]