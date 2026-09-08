"use client";

import { useMemo, useState } from "react";
import type { Player } from "@/lib/types";
import { formatNumber, getPositionStyle } from "@/lib/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield } from "lucide-react";

interface TeamExplorerProps {
  players: Player[];
  teams: string[];
  initialTeam?: string;
}

export function TeamExplorer({ players, teams, initialTeam }: TeamExplorerProps) {
  const [team, setTeam] = useState(initialTeam ?? teams[0] ?? "");

  const roster = useMemo(() => {
    return players
      .filter((p) => p.team === team)
      .sort((a, b) => b.fantasyPointsSafe - a.fantasyPointsSafe);
  }, [players, team]);

  const totalPoints = roster.reduce((acc, p) => acc + p.fantasyPointsSafe, 0);

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-4 w-4 text-primary" />
            Team Roster Explorer
          </CardTitle>
          <CardDescription>
            Pick a team to see every tracked player and their fantasy production.
          </CardDescription>
        </div>
        <Select value={team} onValueChange={(v) => setTeam(v ?? teams[0] ?? "")}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Team" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="mb-3 text-sm text-muted-foreground">
          {roster.length} players tracked · {formatNumber(totalPoints, 1)} combined fantasy points
        </div>
        <div className="rounded-lg border border-border/60 overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Player</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead className="text-right">Games</TableHead>
                  <TableHead className="text-right">Fantasy Points</TableHead>
                  <TableHead className="text-right">PPG</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roster.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPositionStyle(p.position).badge}>
                        {p.position}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(p.games)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">
                      {formatNumber(p.fantasyPoints, 1)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-primary font-semibold">
                      {p.gamesSafe > 0 ? formatNumber(p.pointsPerGame, 1) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
