import { getPlayers } from "@/lib/data";
import { summarizeByTeam } from "@/lib/aggregate";
import { formatNumber } from "@/lib/format";
import { countNflTeams } from "@/lib/nfl-teams";
import { TeamBarChart } from "@/components/charts/team-bar-chart";
import { TeamExplorer } from "@/components/team-explorer";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users2, Trophy, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Team Analysis | Gridiron Analytics",
};

export const revalidate = 3600;

export default async function TeamsPage() {
  const players = await getPlayers();
  const teamSummaries = summarizeByTeam(players);
  const teams = teamSummaries.map((t) => t.team);
  const nflTeamCount = countNflTeams(teams);

  const topTeam = [...teamSummaries].sort(
    (a, b) => b.totalFantasyPoints - a.totalFantasyPoints
  )[0];
  const avgPointsPerTeam = teamSummaries.length
    ? teamSummaries.reduce((acc, t) => acc + t.totalFantasyPoints, 0) / teamSummaries.length
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Users2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Team Analysis</h1>
          <p className="text-muted-foreground">
            Explore fantasy football production broken down by NFL team.
          </p>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Teams Tracked" value={formatNumber(nflTeamCount)} icon={Users2} />
        <StatCard
          label="Top Scoring Team"
          value={topTeam?.team ?? "—"}
          sub={topTeam ? `${formatNumber(topTeam.totalFantasyPoints, 1)} points` : undefined}
          icon={Trophy}
        />
        <StatCard
          label="Avg Points / Team"
          value={formatNumber(avgPointsPerTeam, 1)}
          icon={TrendingUp}
        />
      </section>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-lg">Total Fantasy Points by Team</CardTitle>
          <CardDescription>All tracked teams, ranked highest to lowest.</CardDescription>
        </CardHeader>
        <CardContent>
          <TeamBarChart data={teamSummaries} />
        </CardContent>
      </Card>

      <TeamExplorer players={players} teams={teams} initialTeam={topTeam?.team} />
    </div>
  );
}
