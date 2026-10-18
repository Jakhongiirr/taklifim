# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
WORKDIR /app
ENV CI=true NEXT_TELEMETRY_DISABLED=1

# ---- development: full deps, hot reload (source is bind-mounted) ----
FROM base AS development
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --prefer-offline --no-audit --no-fund
COPY . .
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]

# ---- build: compile to a standalone server ----
FROM base AS build
COPY package*.json ./
# The npm cache survives between builds, so a lockfile change only downloads
# what changed.
RUN --mount=type=cache,target=/root/.npm npm ci --prefer-offline --no-audit --no-fund
COPY . .
# Static pages, robots.txt and the sitemap are rendered now and need it.
ARG SITE_URL
# Turbopack's build cache is kept between builds, so only changed modules are
# recompiled.
RUN --mount=type=cache,id=taklifim-next-cache,target=/app/.next/cache npm run build

# ---- production: minimal runtime image ----
FROM node:24-alpine AS production
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3001 HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/api/health || exit 1
CMD ["node", "server.js"]
