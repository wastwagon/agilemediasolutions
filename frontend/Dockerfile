FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm config set fetch-retries 5 \
  && npm config set fetch-retry-mintimeout 20000 \
  && npm config set fetch-retry-maxtimeout 120000 \
  && npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_SITE_NAME
ENV NEXT_PUBLIC_SITE_NAME=${NEXT_PUBLIC_SITE_NAME}

# Canonical public site URL (no trailing slash). Used for OG metadata, sitemap, JSON-LD.
ARG NEXT_PUBLIC_SITE_URL=https://agile-media.com
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

# Must match your Compose/stack service URL (Coolify: same compose network as backend)
ARG BACKEND_INTERNAL_URL=http://backend:4000
ENV BACKEND_INTERNAL_URL=${BACKEND_INTERNAL_URL}

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY scripts/healthcheck.js ./scripts/healthcheck.js

EXPOSE 3000
CMD ["node", "server.js"]
