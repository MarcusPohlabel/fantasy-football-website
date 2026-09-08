import Link from "next/link";
import { getDataSource, getPlayers } from "@/lib/data";
import { summarizeByPosition } from "@/lib/aggregate";
import { formatNumber } from "@/lib/format";
import { countNflTeams } from "@/lib/nfl-teams";
import { StatCard } from "@/components/stat-card";
import { TopPlayersPreview } from "@/components/top-players-preview";
import { TopPlayersChart } from "@/components/charts/top-players-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Trophy,
  Flame,
  Shield,
  BarChart3,
  Users2,
  ArrowRight,
  Database,
} from "lucide-react";

export const revalidate = 3600;

export default async function HomePage() {
  const [players, dataSource] = await Promise.all([getPlayers(), getDataSource()]);
  const positionSummaries = summarizeByPosition(players);

  const totalTeams = countNflTeams(players.map((p) => p.team));
  const totalFantasyPoints = players.reduce((acc, p) => acc + p.fantasyPointsSafe, 0);
  const playersWithGames = players.filter((p) => p.gamesSafe > 0);
  const avgPpg = playersWithGames.length
    ? playersWithGames.reduce((acc, p) => acc + p.pointsPerGame, 0) / playersWithGames.length
    : 0;
  const topOverall = [...players].sort(
    (a, b) => b.fantasyPointsSafe - a.fantasyPointsSafe
  )[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-primary/5 px-6 py-12 sm:px-12 sm:py-16">
        <div className="relative z-10 max-w-2xl space-y-5">
          <Badge variant="outline" className="gap-1.5 border-primary/30 bg-primary/10 text-primary">
            <Database className="h-3.5 w-3.5" />
            {dataSource === "supabase"
              ? "2021 Season · Live data from Supabase"
              : "Sample dataset · Supabase not connected"}
          </Badge>
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Rank fantasy football players with{" "}
            <span className="text-primary">real analytics</span>.
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore total fantasy points and points-per-game across every position and NFL
            team, with sortable rankings, position breakdowns, and team production tools.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button render={<Link href="/rankings" />} size="lg">
              View Player Rankings <ArrowRight className="h-4 w-4" />
            </Button>
            <Button render={<Link href="/positions" />} size="lg" variant="secondary">
              Compare Positions
            </Button>
          </div>
        </div>
        <Trophy className="pointer-events-none absolute -right-8 -top-8 h-56 w-56 text-primary/10 sm:h-72 sm:w-72" />
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Tracked Players" value={formatNumber(players.length)} icon={Users} />
        <StatCard label="NFL Teams" value={formatNumber(totalTeams)} icon={Shield} />
        <StatCard
          label="Total Fantasy Points"
          value={formatNumber(totalFantasyPoints)}
          sub="Across the full dataset"
          icon={Flame}
        />
        <StatCard
          label="Avg Points / Game"
          value={formatNumber(avgPpg, 1)}
          sub="League-wide average"
          icon={BarChart3}
        />
      </section>

      {/* Top players */}
      <section className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TopPlayersPreview players={players} />
        </div>
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader>
            <CardTitle className="text-lg">Fantasy Points Leaders</CardTitle>
            <CardDescription>
              {topOverall
                ? `${topOverall.name} leads all players with ${formatNumber(topOverall.fantasyPoints, 1)} points.`
                : "Top scorers at a glance."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TopPlayersChart players={players} />
          </CardContent>
        </Card>
      </section>

      {/* Quick links */}
      <section className="grid gap-4 sm:grid-cols-3">
        <QuickLinkCard
          href="/rankings"
          icon={Trophy}
          title="Player Rankings"
          description="Sort, search, and filter every tracked player by fantasy points or PPG."
        />
        <QuickLinkCard
          href="/positions"
          icon={BarChart3}
          title="Position Analysis"
          description={`Compare scoring across ${positionSummaries.length} positions.`}
        />
        <QuickLinkCard
          href="/teams"
          icon={Users2}
          title="Team Analysis"
          description={`Explore fantasy production across ${totalTeams} NFL teams.`}
        />
      </section>
    </div>
  );
}

function QuickLinkCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: typeof Trophy;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="group">
      <Card className="h-full border-border/60 transition-colors group-hover:border-primary/50 group-hover:bg-primary/5">
        <CardContent className="flex flex-col gap-3 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold flex items-center gap-1.5">
              {title}
              <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
