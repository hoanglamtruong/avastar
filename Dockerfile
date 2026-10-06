FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
ARG NEXT_PUBLIC_ALLOW_DEMO_LOGIN=false
ENV NEXT_PUBLIC_ALLOW_DEMO_LOGIN=${NEXT_PUBLIC_ALLOW_DEMO_LOGIN}
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID=""
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
ENV DATABASE_URL="postgresql://zavastar:zavastar_dev_pw@zavastar_postgres:5432/zavastar"
ENV JWT_SECRET="avastar_jwt_secret_key_super_secure_2026_personalhub"
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ARG NEXT_PUBLIC_ALLOW_DEMO_LOGIN=false
ENV NEXT_PUBLIC_ALLOW_DEMO_LOGIN=${NEXT_PUBLIC_ALLOW_DEMO_LOGIN}
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID=""
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app ./

EXPOSE 3000
CMD ["npx", "tsx", "server.ts"]
