# Gridiron Analytics — Fantasy Football Analytics

A fantasy football analytics site built with Next.js (App Router), TypeScript, Tailwind CSS,
shadcn/ui, Recharts, and Supabase. Explore and rank NFL players by total fantasy points and
points per game, compare production across positions, and dig into team-level performance.

## Features

- **Player Rankings** — sortable, searchable, position-filterable table of every tracked player
  (`/rankings`). Click any column header to sort; click again to reverse. Points-per-game is
  computed from `fantasyPoints / games` at render time, with safe fallbacks for missing data.
- **Dashboard** (`/`) — league-wide stats, a top-players leaderboard, and a top-scorers chart.
- **Position Analysis** (`/positions`) — total/average fantasy points and PPG compared across
  QB, RB, WR, TE, K, and DEF, plus per-position leaderboards.
- **Team Analysis** (`/teams`) — total fantasy points by NFL team with a roster explorer.

## Tech stack

- Next.js 16 (App Router, Turbopack)
- TypeScript
- Tailwind CSS v4
- shadcn/ui (Card, Table, Tabs, Select, Dropdown Menu, Input, Badge, Navigation, etc.)
- Recharts
- Supabase (`@supabase/supabase-js`)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Supabase is the primary data source.** The app reads directly from an existing Supabase table
named `2021 Fantasy football data` (671 real player rows). The bundled sample dataset
(`src/data/players.json`) is only used as a fallback if Supabase env vars aren't set, the table
is unreachable, or a query errors — the site never crashes either way.

## Connecting to Supabase (existing table)

1. Copy `.env.local.example` to `.env.local` and fill in the values from **your existing
   Supabase project's** Project Settings → API:

   ```bash
   cp .env.local.example .env.local
   ```

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Restart the dev server. `src/lib/data.ts` queries the `2021 Fantasy football data` table
   directly (see the column mapping in that file — it matches the table's real columns: `Player`,
   `Tm`, `Pos`, `Age`, `G`, `GS`, `Tgt`, `Rec`, `PassingYds`, `PassingTD`, `PassingAtt`,
   `RushingYds`, `RushingTD`, `RushingAtt`, `ReceivingYds`, `ReceivingTD`, `FantasyPoints`, `Int`,
   `Fumbles`, `FumblesLost`) and falls back to sample data only if that query fails.
3. If the page falls back to sample data even with env vars set, the table's Row Level Security
   is likely blocking anonymous reads — run [`supabase/schema.sql`](./supabase/schema.sql) in the
   SQL Editor to add a public-read policy. It does **not** create or modify any data, only a
   read policy on the existing table.

## Project structure

```
src/
  app/
    page.tsx            Dashboard
    rankings/page.tsx   Player Rankings
    positions/page.tsx  Position Analysis
    teams/page.tsx      Team Analysis
  components/
    player-rankings-table.tsx   Interactive sortable/searchable/filterable table
    team-explorer.tsx           Team roster picker
    charts/                     Recharts wrappers
    ui/                         shadcn/ui components
  lib/
    types.ts       Player types + safe derived fields (fantasyPointsSafe, pointsPerGame)
    data.ts        getPlayers() — queries the existing Supabase table, sample-data fallback
    supabase.ts    Supabase client (env-var driven, never hard-coded)
    aggregate.ts   Position/team summary calculations
  data/
    players.json   Bundled sample dataset (fallback only)
supabase/
  schema.sql       RLS read-policy reference for the existing table (no table creation)
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com/new), import the GitHub repository.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from `.env.local`
   (Project Settings → Environment Variables) so the deployed site reads the real dataset from
   Supabase. Without them, the deployed site still works, but shows the sample dataset instead.
4. Deploy.
