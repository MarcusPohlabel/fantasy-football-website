/**
 * Position is intentionally a plain string rather than a fixed union: the
 * real dataset's `Pos` column can contain values we don't want to hard-code
 * against (e.g. no DEF rows at all, or extra positions like FB). Anything
 * that touches "known" positions (styling, chart colors, sort order) uses
 * `sortPositions` / `getPositionStyle` in src/lib/format.ts, which fall back
 * gracefully for unrecognized values instead of crashing.
 */
export type Position = string;

/** Preferred display order for well-known fantasy positions; anything else is appended alphabetically. */
export const KNOWN_POSITION_ORDER = ["QB", "RB", "WR", "TE", "FB", "K", "DEF"] as const;

export function sortPositions(positions: Iterable<string>): string[] {
  const unique = Array.from(new Set(positions));
  return unique.sort((a, b) => {
    const ai = KNOWN_POSITION_ORDER.indexOf(a as (typeof KNOWN_POSITION_ORDER)[number]);
    const bi = KNOWN_POSITION_ORDER.indexOf(b as (typeof KNOWN_POSITION_ORDER)[number]);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });
}

/**
 * Raw player-season row. Mirrors the columns of the existing Supabase table
 * "2021 Fantasy football data" (see src/lib/data.ts for the exact column
 * mapping). Numeric stat fields are nullable because real-world datasets
 * frequently ship with incomplete rows (bye weeks, mid-season trades, etc).
 */
export interface PlayerRow {
  id: number;
  name: string;
  team: string;
  position: Position;
  age: number | null;
  games: number | null;
  gamesStarted: number | null;
  targets: number | null;
  receptions: number | null;
  passingAttempts: number | null;
  passingYards: number | null;
  passingTouchdowns: number | null;
  rushingAttempts: number | null;
  rushingYards: number | null;
  rushingTouchdowns: number | null;
  receivingYards: number | null;
  receivingTouchdowns: number | null;
  interceptions: number | null;
  fumbles: number | null;
  fumblesLost: number | null;
  fantasyPoints: number | null;
}

/** PlayerRow plus derived fields computed client-side (never trusted from source data). */
export interface Player extends PlayerRow {
  fantasyPointsSafe: number;
  gamesSafe: number;
  pointsPerGame: number;
}

export function toPlayer(row: PlayerRow): Player {
  const fantasyPointsSafe =
    typeof row.fantasyPoints === "number" && Number.isFinite(row.fantasyPoints)
      ? row.fantasyPoints
      : 0;
  const gamesSafe =
    typeof row.games === "number" && Number.isFinite(row.games) && row.games > 0
      ? row.games
      : 0;
  const pointsPerGame = gamesSafe > 0 ? fantasyPointsSafe / gamesSafe : 0;

  const position = row.position?.toString().trim().toUpperCase() || "N/A";
  const team = row.team?.toString().trim().toUpperCase() || "FA";
  const name = row.name?.toString().trim() || "Unknown Player";

  return {
    ...row,
    name,
    team,
    position,
    fantasyPointsSafe,
    gamesSafe,
    pointsPerGame: Math.round(pointsPerGame * 10) / 10,
  };
}
