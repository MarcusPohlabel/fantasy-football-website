import { getPlayers } from "@/lib/data";
import { summarizeByPosition } from "@/lib/aggregate";
import { formatNumber, getPositionStyle } from "@/lib/format";
import { PositionBarChart } from "@/components/charts/position-bar-chart";
import { PlayerRankingsTable } from "@/components/player-rankings-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Crown } from "lucide-react";

export const metadata = {
  title: "Position Analysis | Gridiron Analytics",
};

export const revalidate = 3600;

export default async function PositionsPage() {
  const players = await getPlayers();
  const summaries = summarizeByPosition(players);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Position Analysis</h1>
          <p className="text-muted-foreground">
            Compare scoring output across every position tracked in the dataset.
          </p>
        </div>
      </div>

      {/* Comparison charts */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-lg">Total Fantasy Points by Position</CardTitle>
            <CardDescription>Sum of all tracked players at each position.</CardDescription>
          </CardHeader>
          <CardContent>
            <PositionBarChart data={summaries} metric="totalFantasyPoints" />
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-lg">Average Points / Game by Position</CardTitle>
            <CardDescription>Mean PPG across players at each position.</CardDescription>
          </CardHeader>
          <CardContent>
            <PositionBarChart data={summaries} metric="avgPointsPerGame" />
          </CardContent>
        </Card>
      </section>

      {/* Position summary cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summaries.map((s) => (
          <Card key={s.position} className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{s.position}</CardTitle>
              <Badge variant="outline" className={getPositionStyle(s.position).badge}>
                {s.playerCount} players
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Points</span>
                <span className="font-semibold tabular-nums">
                  {formatNumber(s.totalFantasyPoints, 1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Points / Player</span>
                <span className="font-semibold tabular-nums">
                  {formatNumber(s.avgFantasyPoints, 1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Points / Game</span>
                <span className="font-semibold tabular-nums text-primary">
                  {formatNumber(s.avgPointsPerGame, 1)}
                </span>
              </div>
              {s.topPlayer && (
                <div className="mt-3 flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
                  <Crown className="h-4 w-4 shrink-0 text-accent" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{s.topPlayer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.topPlayer.team} · {formatNumber(s.topPlayer.fantasyPoints, 1)} pts
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Per-position rankings */}
      <section className="space-y-4">
        <div>
          <h2 className="font-heading text-xl font-semibold">Rankings by Position</h2>
          <p className="text-sm text-muted-foreground">
            Drill into a single position to see every tracked player, sortable by any column.
          </p>
        </div>
        <Tabs defaultValue={summaries[0]?.position}>
          <TabsList className="flex-wrap h-auto">
            {summaries.map((s) => (
              <TabsTrigger key={s.position} value={s.position}>
                {s.position}
              </TabsTrigger>
            ))}
          </TabsList>
          {summaries.map((s) => (
            <TabsContent key={s.position} value={s.position} className="pt-4">
              <PlayerRankingsTable
                players={players.filter((p) => p.position === s.position)}
                lockedPosition={s.position}
              />
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  );
}
