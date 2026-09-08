export function formatNumber(n: number | null | undefined, digits = 0): string {
  if (typeof n !== "number" || !Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

interface PositionStyle {
  badge: string;
  text: string;
  hex: string;
}

/** Known-position styling. Anything not listed here falls back to a neutral slate style. */
const POSITION_STYLE_MAP: Record<string, PositionStyle> = {
  QB: { badge: "bg-blue-500/15 text-blue-400 border-blue-500/30", text: "text-blue-400", hex: "#60a5fa" },
  RB: { badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", text: "text-emerald-400", hex: "#34d399" },
  WR: { badge: "bg-amber-500/15 text-amber-400 border-amber-500/30", text: "text-amber-400", hex: "#fbbf24" },
  TE: { badge: "bg-violet-500/15 text-violet-400 border-violet-500/30", text: "text-violet-400", hex: "#a78bfa" },
  FB: { badge: "bg-orange-500/15 text-orange-400 border-orange-500/30", text: "text-orange-400", hex: "#fb923c" },
  K: { badge: "bg-rose-500/15 text-rose-400 border-rose-500/30", text: "text-rose-400", hex: "#fb7185" },
  DEF: { badge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30", text: "text-cyan-400", hex: "#22d3ee" },
};

const DEFAULT_POSITION_STYLE: PositionStyle = {
  badge: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  text: "text-slate-400",
  hex: "#94a3b8",
};

export function getPositionStyle(position: string | null | undefined): PositionStyle {
  const key = position?.toString().trim().toUpperCase() ?? "";
  return POSITION_STYLE_MAP[key] ?? DEFAULT_POSITION_STYLE;
}
