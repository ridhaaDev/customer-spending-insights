# customer-client

Next.js dashboard for Customer Spending Insights. See the [root README](../README.md) for the
overall picture.

## Run

```sh
npm ci
npm run dev          # http://localhost:3000, expects the API on http://localhost:8000
npm run storybook    # http://localhost:6006, component catalogue with a light/dark toggle
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
| `npm run storybook` | Storybook dev server |
| `npm run build-storybook` | Static Storybook in `storybook-static/` |

## Layout

```
src/
  app/              layout, page, global styles (design tokens for light/dark)
  components/
    ui/             primitives: Button, Card, CardHeader, Select, Avatar, Skeleton, states
    category/       CategoryIcon, CategoryChip
    nav/            AppShell, TopNav, SideNav, ProfileMenu ("Switch profile")
    dashboard/      Dashboard (data-connected), DashboardHeader, PeriodSelector
    summary/        SummaryCards, StatTile, DeltaBadge
    categories/     CategoryBreakdown, ShareBar, CategoryRow
    trends/         TrendsChart, TrendsBarChart, TrendsTable, TrendTooltip, PeakLabel
    goals/          GoalsPanel, GoalRow, GoalMeter, StatusBadge
    transactions/   TransactionsPanel (data-connected), TransactionTable, TransactionFilters, Pagination
  stories/
    atoms/          Button, Select, Avatar, Skeleton, states, CategoryIcon, CategoryChip, DeltaBadge, StatusBadge, GoalMeter, ShareBar
    molecules/      Card, StatTile, CategoryRow, GoalRow, TrendTooltip, TrendsBarChart, TrendsTable, Pagination, filters, selectors, SideNav, ProfileMenu
    organisms/      SummaryCards, CategoryBreakdown, TrendsChart, GoalsPanel, TopNav
    templates/      AppShell
  hooks/useQuery    small fetch hook: cancels stale requests, keeps previous data while loading
  lib/api.ts        typed client for every endpoint
  lib/types.ts      wire types matching the API's camelCase responses
  lib/format.ts     en-ZA currency, number and date formatting
  test/fixtures.ts  sample payloads shared by stories and tests
```

Components live in feature folders; the Storybook catalogue under `src/stories/` is organised by
atomic-design level instead, so the same component is found by what it is made of. Only `Dashboard`
and `TransactionsPanel` fetch data; everything else is presentational and has a story. Charts use
Recharts; icons are lucide. The page is fully client-rendered, so it works as a static export and
carries no server-only Next features.
