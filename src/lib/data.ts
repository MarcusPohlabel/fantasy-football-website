import "server-only";
import { supabase } from "@/lib/supabase";
import samplePlayers from "@/data/players.json";
import { toPlayer, type Player, type PlayerRow } from "@/lib/types";

/**
 * Name of the existing Supabase table this app reads from. It already
 * contains the real 2021 season fantasy football dataset (671 rows) — the
 * app never creates or writes to this table, only reads it.
 */
const TABLE_NAME = "2021 Fantasy football data";

// Column names exactly as they exist in the Supabase table. Values are typed
// loosely (unknown) because CSV-imported columns sometimes end up typed as
// text in Postgres even when they look numeric — see `toNumberOrNull` below.
interface SupabasePlayerRow {
  id?: unknown;
  Player: unknown;
  Tm: unknown;
  Pos: unknown;
  Age: unknown;
  G: unknown;
  GS: unknown;
  Tgt: unknown;
  Rec: unknown;
  PassingYds: unknown;
  PassingTD: unknown;
  PassingAtt: unknown;
  RushingYds: unknown;
  RushingTD: unknown;
  RushingAtt: unknown;
  ReceivingYds: unknown;
  ReceivingTD: unknown;
  FantasyPoints: unknown;
  Int: unknown;
  Fumbles: unknown;
  FumblesLost: unknown;
}

function toNumberOrNull(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return null;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function toText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

/**
 * Pro-Football-Reference source data suffixes player names with `*`
 * (Pro Bowl) and/or `+` (All-Pro) markers, e.g. "Jonathan Taylor*+". Those
 * are scrape artifacts, not part of the name, so strip them for display.
 */
function cleanPlayerName(value: unknown): string {
  return toText(value).replace(/[*+]+$/, "").trim();
}

function fromSupabaseRow(row: SupabasePlayerRow, index: number): PlayerRow {
  return {
    // The table's primary key column isn't relied on directly (name/type
    // aren't guaranteed) — a stable index-based id is enough since these
    // rows are read-only and never re-ordered server-side.
    id: index + 1,
    name: cleanPlayerName(row.Player),
    team: toText(row.Tm),
    position: toText(row.Pos),
    age: toNumberOrNull(row.Age),
    games: toNumberOrNull(row.G),
    gamesStarted: toNumberOrNull(row.GS),
    targets: toNumberOrNull(row.Tgt),
    receptions: toNumberOrNull(row.Rec),
    passingAttempts: toNumberOrNull(row.PassingAtt),
    passingYards: toNumberOrNull(row.PassingYds),
    passingTouchdowns: toNumberOrNull(row.PassingTD),
    rushingAttempts: toNumberOrNull(row.RushingAtt),
    rushingYards: toNumberOrNull(row.RushingYds),
    rushingTouchdowns: toNumberOrNull(row.RushingTD),
    receivingYards: toNumberOrNull(row.ReceivingYds),
    receivingTouchdowns: toNumberOrNull(row.ReceivingTD),
    interceptions: toNumberOrNull(row.Int),
    fumbles: toNumberOrNull(row.Fumbles),
    fumblesLost: toNumberOrNull(row.FumblesLost),
    fantasyPoints: toNumberOrNull(row.FantasyPoints),
  };
}

/**
 * Fetches the full player-season dataset. Supabase (the existing
 * "2021 Fantasy football data" table) is the primary source. The bundled
 * sample dataset is only ever used as a fallback — when Supabase env vars
 * aren't configured, the table is unreachable, or a query errors out — so
 * the site stays functional no matter what.
 */
export async function getPlayers(): Promise<Player[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .returns<SupabasePlayerRow[]>();

      if (!error && data && data.length > 0) {
        return data.map((row, i) => toPlayer(fromSupabaseRow(row, i)));
      }
      if (error) {
        console.error("Supabase query failed, falling back to sample data:", error.message);
      }
    } catch (err) {
      console.error("Supabase request threw, falling back to sample data:", err);
    }
  }

  return (samplePlayers as PlayerRow[]).map(toPlayer);
}

export async function getDataSource(): Promise<"supabase" | "sample"> {
  if (!supabase) return "sample";
  try {
    const { count, error } = await supabase
      .from(TABLE_NAME)
      .select("*", { count: "exact", head: true });
    if (!error && count && count > 0) return "supabase";
  } catch {
    // ignore — treated as sample fallback below
  }
  return "sample";
}
