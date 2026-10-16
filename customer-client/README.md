# customer-client

Next.js dashboard for Customer Spending Insights. See the [root README](../README.md) for the
overall picture.

## Run

```sh
npm ci
npm run dev          # http://localhost:3000, expects the API on http://localhost:8000
npm run storybook    # http://localhost:6006, component catalogue with a theme toolbar
```

| Variable | Read | Purpose |
|----------|------|---------|
| `NEXT_PUBLIC_API_URL` | at build time, by the browser | Where the browser fetches the API (default `http://localhost:8000`) |
| `API_URL` | at runtime, by the Next server | Where server rendering fetches the API; falls back to the public URL. In compose it is `http://api:8000` |

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build with a standalone Node server in `.next/standalone` |
| `npm start` | Serve the production build |
| `npm test` | Vitest unit tests (jsdom), including an axe accessibility suite |
| `npm run lint` | ESLint (Next core-web-vitals, TypeScript and jsx-a11y rules) |
| `npm run typecheck` | Generates Next route types, then `tsc --noEmit` |
| `npm run storybook` | Storybook dev server |
| `npm run build-storybook` | Static Storybook in `storybook-static/` |

## Pages

| Route | Shows |
|-------|-------|
| `/` | Redirects to the first customer |
| `/customers/{id}` | Customer header, period selector, headline stats, recent transactions |
| `/customers/{id}/categories` | Spend by category for a preset period or a custom date range |
| `/customers/{id}/trends` | Monthly totals for the last 6, 12 or 24 months, chart or table |
| `/customers/{id}/budgets` | Month-to-date spend against each budget |
| `/customers/{id}/transactions` | Full list with category, sort, date range and paging |

View state lives in the URL so every view is a shareable link: `?period=7d|30d|90d|1y`,
`?from=YYYY-MM-DD&to=YYYY-MM-DD` (overrides the period), `?months=6|12|24`. Switching customer
in the profile menu keeps the section and the search params.

## Data flow

Each route is a server component that prefetches its queries into a per-request TanStack Query
client and passes them to the client page through a `HydrationBoundary`, so the first HTML already
contains the numbers. The same `queryOptions` (in `lib/queries.ts`) are used on the client, where
TanStack Query owns caching: revisiting a page is instant, changing the period keeps the previous
data on screen (dimmed) until the new data arrives, and identical requests are deduplicated. An
unknown customer renders the `not-found` page; `loading.tsx` covers the first server render of a
page and `experimental.staleTimes` lets recently visited pages render from the router cache.

## Themes

The theme menu in the top bar offers System, Light, Dark and Candy (a lavender-to-pink gradient
with purple ink). The choice is kept in `localStorage` and applied to `<html data-theme>` by an
inline script before first paint, so there is no flash. Every theme is a set of CSS custom
properties in `globals.css`; components only ever reference the role tokens, and each theme is
checked for AA contrast.

## Accessibility

Interactive patterns with a keyboard model come from Radix primitives: the profile switcher and
theme menu are non-modal `DropdownMenu`s with radio groups (arrow keys, Escape, focus return), the
mobile navigation is a `Dialog` (focus trap, Escape, focus return), and the segmented controls are
a `RadioGroup` (arrow keys, roving tab index). Native `select` and `input type="date"` are used
where the browser's own control is already accessible. Colour tokens are chosen to clear WCAG AA
contrast on both the page surface and cards, and status is always paired with an icon and text.

Three layers keep it honest:

- `eslint-plugin-jsx-a11y` recommended rules run in `npm run lint`.
- `src/test/a11y.test.tsx` renders the main components and asserts zero axe violations
  (`vitest-axe`; contrast is skipped there because jsdom has no layout).
- Storybook's Accessibility panel (`@storybook/addon-a11y`) runs axe against every story, including
  contrast, in every theme via the toolbar.

## Layout

```
src/
  app/              root layout; /customers/[customerId]/… routes (server components), loading, not-found, error
  context/          ThemeContext
  hooks/useUrlState view state in the search params (period, months, date range)
  lib/queries.ts    TanStack queryOptions shared by server prefetch and client
  lib/params.ts     search-param parsing and customer path helpers
  lib/api.ts        typed client for every endpoint (server and browser base URLs)
  lib/types.ts      wire types matching the API's camelCase responses
  lib/format.ts     en-ZA currency, number and date formatting
  components/
    pages/          one client page component per route, plus the shared PageFrame
    providers/      QueryProvider
    ui/             primitives: Button, Card, CardHeader, Select, Avatar, Skeleton, SegmentedControl, PageHeader, states
    category/       CategoryIcon, CategoryChip
    nav/            AppShell, ConnectedShell, TopNav, SideNav, ProfileMenu, ThemeMenu
    dashboard/      DashboardHeader, PeriodSelector, DateRangePicker
    summary/        SummaryCards, StatTile, DeltaBadge
    categories/     CategoryBreakdown, ShareBar, CategoryRow
    trends/         TrendsChart, TrendsBarChart, TrendsTable, TrendTooltip, PeakLabel
    goals/          GoalsPanel, GoalRow, GoalMeter, StatusBadge
    transactions/   TransactionsPanel and RecentTransactions (query-connected), TransactionTable, TransactionFilters, Pagination
  stories/          Storybook catalogue by atomic level: atoms, molecules, organisms, templates
  test/fixtures.ts  sample payloads shared by stories and tests
```

Components live in feature folders; the Storybook catalogue under `src/stories/` is organised by
atomic-design level instead. Only the page components, `TransactionsPanel` and
`RecentTransactions` touch queries; everything else is presentational and has a story.

## Deploying

`npm run build` produces a standalone Node server. The Dockerfile has two production targets:

- `prod`: the server on `node:22-alpine`, non-root, port 3000. Runs on any container platform.
- `lambda`: the same image with the AWS Lambda Web Adapter, for a container-image Lambda behind a
  Function URL or API Gateway, with CloudFront in front for caching and the custom domain.

```sh
docker build --target prod   --build-arg NEXT_PUBLIC_API_URL=https://api.example.com -t customer-client .
docker build --target lambda --build-arg NEXT_PUBLIC_API_URL=https://api.example.com -t customer-client-lambda .
docker run --rm -p 3000:3000 -e API_URL=https://api.example.com customer-client
```
