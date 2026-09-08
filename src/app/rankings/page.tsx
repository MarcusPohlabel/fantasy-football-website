import { getPlayers } from "@/lib/data";
import { PlayerRankingsTable } from "@/components/player-rankings-table";
import { Trophy } from "lucide-react";

export const metadata = {
  title: "Player Rankings | Gridiron Analytics",
};

export const revalidate = 3600;

export default async function RankingsPage() {
  const players = await getPlayers();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Trophy className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Player Rankings</h1>
          <p className="text-muted-foreground">
            Sorted by fantasy points by default. Click any column header to sort — click again to reverse.
          </p>
        </div>
      </div>

      <PlayerRankingsTable players={players} />
    </div>
  );
}
