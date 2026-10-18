# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
WORKDIR /app
ENV CI=true

# ---- development: full deps, hot reload (source is bind-mounted) ----
FROM base AS development
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --prefer-offline --no-audit --no-fund
COPY . .
# Compiles to /tmp/nest-dist (see tsconfig.docker.json); point it at our packages.
ENV NODE_PATH=/app/node_modules
CMD ["npm", "run", "start:dev", "--", "--path", "tsconfig.docker.json"]

# ---- prod-deps: runtime packages only ----
# Its own stage so the layer is reused until the lockfile changes: a code-only
# deploy doesn't reinstall or recopy node_modules.
FROM base AS prod-deps
COPY package*.json ./
# The npm cache survives between builds, so a lockfile change only downloads
# what changed.
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev --prefer-offline --no-audit --no-fund

# ---- build: compile TypeScript ----
FROM base AS build
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --prefer-offline --no-audit --no-fund
COPY . .
RUN npm run build

# ---- production: minimal runtime image ----
FROM node:24-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --chown=node:node package*.json ./
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT:-3000}/health || exit 1
CMD ["node", "dist/main"]
