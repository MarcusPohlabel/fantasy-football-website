-- Gridiron Analytics — Supabase reference
--
-- This app reads from an EXISTING table you already created in a previous
-- assignment: "2021 Fantasy football data" (671 rows). The app does not
-- create, seed, or duplicate that table — src/lib/data.ts queries it
-- directly and maps its columns to the shape the UI expects.
--
-- Existing table columns (as provided):
--   Player, Tm, Pos, Age, G, GS, Tgt, Rec,
--   PassingYds, PassingTD, PassingAtt,
--   RushingYds, RushingTD, RushingAtt,
--   ReceivingYds, ReceivingTD,
--   FantasyPoints, Int, Fumbles, FumblesLost
--
-- Nothing below needs to run for the app to work if the table's RLS is
-- already permissive. It's here only as a safety net in case anonymous
-- reads (the NEXT_PUBLIC_SUPABASE_ANON_KEY the app uses) are currently
-- blocked by Row Level Security. Run it once in the Supabase SQL editor
-- if `getPlayers()` falls back to sample data despite env vars being set.

alter table if exists public."2021 Fantasy football data" enable row level security;

drop policy if exists "Public read access" on public."2021 Fantasy football data";
create policy "Public read access"
  on public."2021 Fantasy football data" for select
  using (true);
