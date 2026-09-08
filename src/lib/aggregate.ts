import type { Player, Position } from "@/lib/types";
import { sortPositions } from "@/lib/types";

export interface PositionSummary {
  position: Position;
  playerCount: number;
  totalFantasyPoints: number;
  avgFantasyPoints: number;
  avgPointsPerGame: number;
  topPlayer: Player | null;
}

export function summarizeByPosition(players: Player[]): PositionSummary[] {
  const positions = sortPositions(players.map((p) => p.position));
  return positions.map((position) => {
    const group = players.filter((p) => p.position === position);
    const totalFantasyPoints = sum(group.map((p) => p.fantasyPointsSafe));
    const avgFantasyPoints = group.length ? totalFantasyPoints / group.length : 0;
    const avgPointsPerGame = group.length
      ? sum(group.map((p) => p.pointsPerGame)) / group.length
      : 0;
    const topPlayer = group.length
      ? group.reduce((best, p) =>
          p.fantasyPointsSafe > best.fantasyPointsSafe ? p : best
        )
      : null;

    return {
      position,
      playerCount: group.length,
      totalFantasyPoints: round1(totalFantasyPoints),
      avgFantasyPoints: round1(avgFantasyPoints),
      avgPointsPerGame: round1(avgPointsPerGame),
      topPlayer,
    };
  }).filter((summary) => summary.playerCount > 0);
}

export interface TeamSummary {
  team: string;
  playerCount: number;
  totalFantasyPoints: number;
  avgPointsPerGame: number;
  topPlayer: Player | null;
  positionBreakdown: Partial<Record<Position, number>>;
}

export function summarizeByTeam(players: Player[]): TeamSummary[] {
  const teams = Array.from(new Set(players.map((p) => p.team))).sort();

  return teams.map((team) => {
    const group = players.filter((p) => p.team === team);
    const totalFantasyPoints = sum(group.map((p) => p.fantasyPointsSafe));
    const avgPointsPerGame = group.length
      ? sum(group.map((p) => p.pointsPerGame)) / group.length
      : 0;
    const topPlayer = group.length
      ? group.reduce((best, p) =>
          p.fantasyPointsSafe > best.fantasyPointsSafe ? p : best
        )
      : null;

    const positionBreakdown: Partial<Record<Position, number>> = {};
    for (const p of group) {
      positionBreakdown[p.position] =
        (positionBreakdown[p.position] ?? 0) + p.fantasyPointsSafe;
    }
    for (const key of Object.keys(positionBreakdown) as Position[]) {
      positionBreakdown[key] = round1(positionBreakdown[key]!);
    }

    return {
      team,
      playerCount: group.length,
      totalFantasyPoints: round1(totalFantasyPoints),
      avgPointsPerGame: round1(avgPointsPerGame),
      topPlayer,
      positionBreakdown,
    };
  });
}

function sum(values: number[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
