import Link from "next/link";
import type { Player } from "@/lib/types";
import { formatNumber, getPositionStyle } from "@/lib/format";
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
import { Button } from "@/components/ui/button";
import { ArrowRight, Crown } from "lucide-react";

interface TopPlayersPreviewProps {
  players: Player[];
  limit?: number;
}

export function TopPlayersPreview({ players, limit = 10 }: TopPlayersPreviewProps) {
  const top = [...players]
    .sort((a, b) => b.fantasyPointsSafe - a.fantasyPointsSafe)
    .slice(0, limit);

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Crown className="h-4 w-4 text-accent" />
            Top Fantasy Players
          </CardTitle>
          <CardDescription>Highest total fantasy points across every position.</CardDescription>
        </div>
        <Button render={<Link href="/rankings" />} variant="ghost" size="sm">
          Full rankings <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10 text-center">#</TableHead>
                <TableHead>Player</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Pos</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead className="text-right">PPG</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {top.map((p, i) => (
                <TableRow key={p.id}>
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {i + 1}
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">{p.team}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getPositionStyle(p.position).badge}>
                      {p.position}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
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
      </CardContent>
    </Card>
  );
}
