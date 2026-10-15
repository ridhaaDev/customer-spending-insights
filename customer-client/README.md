# customer-client

Next.js dashboard for Customer Spending Insights. See the [root README](../README.md) for the
overall picture.

## Run

```sh
npm ci
npm run dev          # http://localhost:3000, expects the API on http://localhost:8000
```

Set `NEXT_PUBLIC_API_URL` to point at a different API. It is read at build time, so the production
build must be given the real URL (`--build-arg NEXT_PUBLIC_API_URL=…` for Docker).

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Static export to `out/` (`output: "export"`) |
| `npm test` | Vitest unit tests (jsdom) |
| `npm run lint` | ESLint (Next core-web-vitals + TypeScript rules) |
| `npm run typecheck` | Generates Next route types, then `tsc --noEmit` |

## Layout

```
src/
  app/            layout, page, global styles (design tokens for light/dark)
  components/     Dashboard (orchestration) and one component per panel
  hooks/useQuery  small fetch hook: cancels stale requests, keeps previous data while loading
  lib/api.ts      typed client for every endpoint
  lib/types.ts    wire types matching the API's camelCase responses
  lib/format.ts   en-ZA currency, number and date formatting
```

Charts use Recharts; icons are lucide. The page is fully client-rendered, so it works as a static
export and carries no server-only Next features.
