# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
WORKDIR /app
ENV CI=true

# ---- development: full deps, hot reload (source is bind-mounted) ----
FROM base AS development
COPY package*.json ./
RUN npm ci
COPY . .
# Compiles to /tmp/nest-dist (see tsconfig.docker.json); point it at our packages.
ENV NODE_PATH=/app/node_modules
CMD ["npm", "run", "start:dev", "--", "--path", "tsconfig.docker.json"]

# ---- build: compile TypeScript ----
FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

# ---- production: minimal runtime image ----
FROM node:24-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build --chown=node:node /app/package*.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT:-3000}/health || exit 1
CMD ["node", "dist/main"]
