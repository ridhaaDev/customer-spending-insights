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

# Build stage: static export to /app/out.
# NEXT_PUBLIC_* values are baked in here, so pass them as build args.
FROM deps AS build
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
COPY . .
RUN npm run build

# Production image: serve the static export with nginx.
# Note: the hosting plan uploads /app/out to S3 + CloudFront instead, so this
# image is for local parity testing or if hosting moves to a container platform.
FROM nginx:1.27-alpine AS prod
COPY --from=build /app/out /usr/share/nginx/html
RUN printf 'server {\n  listen 80;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / { try_files $uri $uri.html $uri/ =404; }\n  error_page 404 /404.html;\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
