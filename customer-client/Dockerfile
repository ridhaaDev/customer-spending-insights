# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
COPY package.json package-lock.json ./
# The stamp records which lockfile these node_modules were installed from (see the dev CMD).
RUN npm ci && cp package-lock.json node_modules/.package-lock.stamp

# Development image: source is bind-mounted by compose, dev server with HMR.
# node_modules lives in a compose volume that outlives image rebuilds, so on start we
# reinstall if the lockfile no longer matches the stamp (i.e. dependencies changed).
FROM deps AS dev
COPY . .
EXPOSE 3000
CMD ["sh", "-c", "if ! cmp -s package-lock.json node_modules/.package-lock.stamp; then echo 'Lockfile changed, reinstalling dependencies…' && npm ci --no-audit --no-fund && cp package-lock.json node_modules/.package-lock.stamp; fi && exec npm run dev -- --hostname 0.0.0.0"]

# Build stage: standalone server in .next/standalone.
# NEXT_PUBLIC_* values are baked in here (the browser's API URL), so pass them as build args.
# API_URL (the server's API URL) is read at runtime instead.
FROM deps AS build
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
COPY . .
RUN npm run build

# Production image: the self-contained Node server, non-root. Runs anywhere a container runs.
FROM node:22-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
RUN addgroup -S app && adduser -S -G app app && chown -R app:app /app
USER app
EXPOSE 3000
CMD ["node", "server.js"]

# Lambda image: the same server behind the Lambda Web Adapter, so a Function URL or API Gateway
# can invoke it like any HTTP service. Deploy as a container-image Lambda (arm64 or x86_64).
FROM prod AS lambda
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 /lambda-adapter /opt/extensions/lambda-adapter
ENV AWS_LWA_PORT=3000 AWS_LWA_READINESS_CHECK_PROTOCOL=tcp
