# BUILDER
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# RUNTIME
FROM node:24-alpine AS runtime

ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.* ./

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=15s --start-period= --retries=3 \
    CMD curl -f http://localhost:3000

CMD ["npm", "run", "start"]