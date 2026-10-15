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

## Pages

| Route | Shows |
|-------|-------|
| `/` | Customer header, period selector, headline stats, recent transactions |
| `/categories` | Spend by category for a preset period or a custom date range |
| `/trends` | Monthly totals for the last 6, 12 or 24 months, chart or table |
| `/budgets` | Month-to-date spend against each budget |
| `/transactions` | Full list with category, sort, date range and paging |

The chosen customer (remembered in `localStorage`) and the period are shared across pages through
`DashboardContext`, provided in the root layout together with the app shell.

## Themes

The theme menu in the top bar offers System, Light, Dark and Candy (a lavender-to-pink gradient
with purple ink). The choice is kept in `localStorage` and applied to `<html data-theme>` by an
inline script before first paint, so there is no flash. Every theme is a set of CSS custom
properties in `globals.css`; components only ever reference the role tokens, and each theme is
checked for AA contrast.

## Accessibility

Interactive patterns with a keyboard model come from Radix primitives: the profile switcher is a
`DropdownMenu` with a radio group (arrow keys, Escape, focus return), the mobile navigation is a
`Dialog` (focus trap, Escape, focus return), and the segmented controls are a `RadioGroup` (arrow
keys, roving tab index). Native `select` and `input type="date"` are used where the browser's own
control is already accessible. Colour tokens are chosen to clear WCAG AA contrast on both the page
surface and cards, and status is always paired with an icon and text.

Three layers keep it honest:

- `eslint-plugin-jsx-a11y` recommended rules run in `npm run lint`.
- `src/test/a11y.test.tsx` renders the main components and asserts zero axe violations
  (`vitest-axe`; contrast is skipped there because jsdom has no layout).
- Storybook's Accessibility panel (`@storybook/addon-a11y`) runs axe against every story, including
  contrast, in light and dark via the theme toolbar.

## Layout

```
src/
  app/              root layout and one folder per route; global styles (design tokens)
  context/          DashboardContext: customers list, selected customer, period
  components/
    pages/          one data-connected component per route, plus the shared PageFrame
    ui/             primitives: Button, Card, CardHeader, Select, Avatar, Skeleton, SegmentedControl, PageHeader, states
    category/       CategoryIcon, CategoryChip
    nav/            AppShell, ConnectedShell, TopNav, SideNav, ProfileMenu ("Switch profile")
    dashboard/      DashboardHeader, PeriodSelector, DateRangePicker
    summary/        SummaryCards, StatTile, DeltaBadge
    categories/     CategoryBreakdown, ShareBar, CategoryRow
    trends/         TrendsChart, TrendsBarChart, TrendsTable, TrendTooltip, PeakLabel
    goals/          GoalsPanel, GoalRow, GoalMeter, StatusBadge
    transactions/   TransactionsPanel and RecentTransactions (data-connected), TransactionTable, TransactionFilters, Pagination
  stories/
    atoms/          Button, Select, Avatar, Skeleton, states, SegmentedControl, CategoryIcon, CategoryChip, DeltaBadge, StatusBadge, GoalMeter, ShareBar
    molecules/      Card, PageHeader, StatTile, CategoryRow, GoalRow, TrendTooltip, TrendsBarChart, TrendsTable, Pagination, filters, selectors, DateRangePicker, SideNav, ProfileMenu
    organisms/      SummaryCards, CategoryBreakdown, TrendsChart, GoalsPanel, TopNav
    templates/      AppShell
  hooks/useQuery    small fetch hook: cancels stale requests, keeps previous data while loading
  lib/api.ts        typed client for every endpoint
  lib/types.ts      wire types matching the API's camelCase responses
  lib/format.ts     en-ZA currency, number and date formatting
  test/fixtures.ts  sample payloads shared by stories and tests
```

Components live in feature folders; the Storybook catalogue under `src/stories/` is organised by
atomic-design level instead, so the same component is found by what it is made of. Only the page
components, `TransactionsPanel` and `RecentTransactions` fetch data; everything else is
presentational and has a story. Charts use
Recharts; icons are lucide. The page is fully client-rendered, so it works as a static export and
carries no server-only Next features.
