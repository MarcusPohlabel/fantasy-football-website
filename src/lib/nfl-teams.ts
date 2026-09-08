/**
 * Canonical list of the 32 real NFL franchises' team abbreviations, in the
 * same style used by the "2021 Fantasy football data" Supabase table (which
 * follows Pro-Football-Reference's codes, e.g. GNB not GB, KAN not KC,
 * LVR not LV, NOR not NO, NWE not NE, SFO not SF, TAM not TB).
 *
 * That table's `Tm` column also contains non-franchise codes — "2TM" / "3TM"
 * — which Pro-Football-Reference uses for a player's combined stat line when
 * they were traded mid-season and played for multiple teams. Those rows are
 * real player data (kept everywhere else in the app), but they are not NFL
 * teams, so anything counting "how many NFL teams" should filter through
 * this list rather than counting distinct `Tm` values directly.
 */
export const NFL_TEAM_ABBREVIATIONS: ReadonlySet<string> = new Set([
  "ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE",
  "DAL", "DEN", "DET", "GNB", "HOU", "IND", "JAX", "KAN",
  "LAC", "LAR", "LVR", "MIA", "MIN", "NWE", "NOR", "NYG",
  "NYJ", "PHI", "PIT", "SEA", "SFO", "TAM", "TEN", "WAS",
]);

export function isNflTeam(team: string | null | undefined): boolean {
  if (!team) return false;
  return NFL_TEAM_ABBREVIATIONS.has(team.trim().toUpperCase());
}

/** Counts distinct *real* NFL teams present in a list of team codes, ignoring multi-team codes like "2TM"/"3TM" and any other junk values. */
export function countNflTeams(teams: Iterable<string>): number {
  const valid = new Set<string>();
  for (const team of teams) {
    const key = team?.trim().toUpperCase();
    if (key && NFL_TEAM_ABBREVIATIONS.has(key)) valid.add(key);
  }
  return valid.size;
}
