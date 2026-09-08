"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import type { Player } from "@/lib/types";
import { getPositionStyle } from "@/lib/format";

interface TopPlayersChartProps {
  players: Player[];
}

export function TopPlayersChart({ players }: TopPlayersChartProps) {
  const data = [...players]
    .sort((a, b) => b.fantasyPointsSafe - a.fantasyPointsSafe)
    .slice(0, 8)
    .map((p) => ({ ...p, shortName: shorten(p.name) }))
    .reverse();

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 24, left: 0, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis
          type="number"
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="shortName"
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={110}
        />
        <Tooltip
          cursor={{ fill: "var(--muted)" }}
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            color: "var(--popover-foreground)",
            fontSize: 12,
          }}
          formatter={(value) => [Number(value).toFixed(1), "Fantasy Points"]}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.name ?? ""}
        />
        <Bar dataKey="fantasyPointsSafe" radius={[0, 6, 6, 0]} maxBarSize={20}>
          {data.map((entry) => (
            <Cell key={entry.id} fill={getPositionStyle(entry.position).hex} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function shorten(name: string): string {
  if (name.length <= 16) return name;
  const parts = name.split(" ");
  if (parts.length < 2) return name.slice(0, 15) + "…";
  return `${parts[0][0]}. ${parts.slice(1).join(" ")}`;
}
