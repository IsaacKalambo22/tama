FROM node:22-alpine AS base

# Setup pnpm environment
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

FROM base AS builder
RUN apk update
RUN apk add --no-cache 

# Set working directory
WORKDIR /app
RUN pnpm install turbo --global
RUN pnpm install prisma@6 
COPY . .
RUN turbo prune api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache
WORKDIR /app
# Copy prisma schema before running generate
COPY ./apps/api/prisma .

# First install dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN pnpm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN


FROM base AS runner
WORKDIR /app


COPY --from=installer /app .

CMD ["sh", "-c", "cd apps/api && pnpm run db:deploy && pnpm run start"]

