"use client";

import { useMemo, useState } from "react";
import type { Player, Position } from "@/lib/types";
import { sortPositions } from "@/lib/types";
import { formatNumber, getPositionStyle } from "@/lib/format";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, ArrowUpNarrowWide, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type SortKey =
  | "name"
  | "team"
  | "position"
  | "games"
  | "fantasyPointsSafe"
  | "pointsPerGame";

interface Column {
  key: SortKey;
  label: string;
  align?: "left" | "right";
  defaultDir?: "asc" | "desc";
}

const COLUMNS: Column[] = [
  { key: "name", label: "Player", align: "left", defaultDir: "asc" },
  { key: "team", label: "Team", align: "left", defaultDir: "asc" },
  { key: "position", label: "Position", align: "left", defaultDir: "asc" },
  { key: "games", label: "Games", align: "right", defaultDir: "desc" },
  { key: "fantasyPointsSafe", label: "Fantasy Points", align: "right", defaultDir: "desc" },
  { key: "pointsPerGame", label: "Points / Game", align: "right", defaultDir: "desc" },
];

interface PlayerRankingsTableProps {
  players: Player[];
  /** Restrict the position filter/tabs to this fixed position (hides "Overall" + the selector). */
  lockedPosition?: Position;
}

export function PlayerRankingsTable({ players, lockedPosition }: PlayerRankingsTableProps) {
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState<Position | "ALL">(lockedPosition ?? "ALL");
  const [sortKey, setSortKey] = useState<SortKey>("fantasyPointsSafe");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const availablePositions = useMemo(
    () => sortPositions(players.map((p) => p.position)),
    [players]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return players.filter((p) => {
      if (position !== "ALL" && p.position !== position) return false;
      if (!term) return true;
      return (
        p.name.toLowerCase().includes(term) || p.team.toLowerCase().includes(term)
      );
    });
  }, [players, search, position]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      switch (sortKey) {
        case "name":
        case "team":
        case "position":
          av = a[sortKey];
          bv = b[sortKey];
          return sortDir === "asc"
            ? String(av).localeCompare(String(bv))
            : String(bv).localeCompare(String(av));
        case "games":
          av = a.gamesSafe;
          bv = b.gamesSafe;
          break;
        default:
          av = a[sortKey] as number;
          bv = b[sortKey] as number;
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  function handleSort(column: Column) {
    if (sortKey === column.key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(column.key);
      setSortDir(column.defaultDir ?? "desc");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search player or team..."
            className="pl-8"
          />
        </div>

        <div className="flex items-center gap-2">
          {!lockedPosition && (
            <>
              <span className="hidden sm:inline text-sm text-muted-foreground">Position</span>
              <Select
                value={position}
                onValueChange={(v) => setPosition((v as Position | "ALL") ?? "ALL")}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Positions</SelectItem>
                  {availablePositions.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
              <ArrowUpNarrowWide className="h-4 w-4" />
              Sort by
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={sortKey}
                onValueChange={(v) => {
                  const column = COLUMNS.find((c) => c.key === v);
                  if (column) handleSort(column);
                }}
              >
                {COLUMNS.map((col) => (
                  <DropdownMenuRadioItem key={col.key} value={col.key}>
                    {col.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {!lockedPosition && (
        <Tabs value={position} onValueChange={(v) => setPosition(v as Position | "ALL")}>
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="ALL">Overall</TabsTrigger>
            {availablePositions.map((p) => (
              <TabsTrigger key={p} value={p}>
                {p}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12 text-center">#</TableHead>
                {COLUMNS.map((col) => (
                  <TableHead
                    key={col.key}
                    className={cn(
                      "select-none",
                      col.align === "right" ? "text-right" : "text-left"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(col)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
                        col.align === "right" && "flex-row-reverse"
                      )}
                    >
                      {col.label}
                      {sortKey === col.key ? (
                        sortDir === "asc" ? (
                          <ArrowUp className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5 text-primary" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                      )}
                    </button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length + 1} className="h-24 text-center text-muted-foreground">
                    No players match your search.
                  </TableCell>
                </TableRow>
              ) : (
                sorted.map((p, i) => (
                  <TableRow key={p.id} className="group">
                    <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      <span className="group-hover:text-primary transition-colors">
                        {p.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.team}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("font-mono text-xs", getPositionStyle(p.position).badge)}
                      >
                        {p.position}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(p.games)}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatNumber(p.fantasyPoints, 1)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-primary font-semibold">
                      {p.gamesSafe > 0 ? formatNumber(p.pointsPerGame, 1) : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {sorted.length} of {players.length} players
        {position !== "ALL" ? ` at ${position}` : ""}
        {search ? ` matching "${search}"` : ""}.
      </p>
    </div>
  );
}
