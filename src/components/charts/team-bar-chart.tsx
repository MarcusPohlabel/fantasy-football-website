"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TeamSummary } from "@/lib/aggregate";

interface TeamBarChartProps {
  data: TeamSummary[];
}

export function TeamBarChart({ data }: TeamBarChartProps) {
  const sorted = [...data].sort((a, b) => b.totalFantasyPoints - a.totalFantasyPoints);

  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart data={sorted} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="team"
          stroke="var(--muted-foreground)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={50}
        />
        <YAxis
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={44}
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
          formatter={(value) => [Number(value).toFixed(1), "Total Fantasy Points"]}
        />
        <Bar dataKey="totalFantasyPoints" radius={[6, 6, 0, 0]} fill="var(--primary)" maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
