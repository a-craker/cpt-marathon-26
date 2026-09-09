import { useMemo } from "react";
import pyr from "../data/pyramid.json";
import { scaleLinear } from "../lib/chart";

const W = 900, H = 300;
const M = { t: 30, r: 40, b: 40, l: 40 };
const CAT_ORDER = ["Senior", "40-49", "50-59", "60-69", "70+"];
const COLS = { Male: "var(--color-signal)", Female: "var(--color-flare)" };

export default function CategoryPyramid() {
  const { rows, sx, max } = useMemo(() => {
    const max = Math.max(...pyr.map((d) => d.n)) * 1.08;
    const sx = scaleLinear([-max, max], [M.l, W - M.r]);
    // one row per category with both genders
    const rows = CAT_ORDER.map((cat) => ({
      cat,
      Male: pyr.find((d) => d.category === cat && d.gender === "Male")?.n ?? 0,
      Female: pyr.find((d) => d.category === cat && d.gender === "Female")?.n ?? 0,
    }));
    return { rows, sx, max };
  }, []);

  const ih = H - M.t - M.b;
  const rh = ih / CAT_ORDER.length;
  const bh = rh * 0.56;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto overflow-visible">
      {/* centre axis */}
      <line x1={sx(0)} x2={sx(0)} y1={M.t - 8} y2={M.t + ih}
        stroke="var(--color-ink)" strokeWidth="1" />

      {rows.map((r, i) => {
        const y = M.t + i * rh + (rh - bh) / 2;
        return (
          <g key={r.cat}>
            {/* male, left */}
            <rect x={sx(-r.Male)} y={y} width={sx(0) - sx(-r.Male)} height={bh}
              fill={COLS.Male} opacity="0.85" />
            <text 
            x={sx(-r.Male) - 7} 
            y={y + bh / 2 + 3.5} 
            textAnchor="end"
            className="font-mono" 
            fontSize="11"
            fontWeight="700"
            fill={COLS.Male}>
            {r.Male.toLocaleString()}
            </text>
            {/* female, right */}
            <rect x={sx(0)} y={y} width={sx(r.Female) - sx(0)} height={bh}
              fill={COLS.Female} opacity="0.85" />
            <text 
            x={sx(r.Female) + 7} 
            y={y + bh / 2 + 3.5} 
            textAnchor="start"
            className="font-mono" 
            fontSize="11"
            fontWeight="700"
            fill={COLS.Female}>
            {r.Female.toLocaleString()}
            </text>
            {/* category label on centre line */}
            <text
              x={sx(0)}
              y={y - 5}
              textAnchor="middle"
              className="font-mono"
              fontSize="11.5"
              fontWeight="700"
              fill="var(--color-ink)">
              {r.cat}
            </text>
          </g>
        );
      })}

      {/* legend */}
      <text x={M.l} y={M.t - 12} className="font-mono" fontSize="11"
        fontWeight="700" fill={COLS.Male} style={{ letterSpacing: ".14em" }}>
        MEN
      </text>
      <text x={W - M.r} y={M.t - 12} textAnchor="end" className="font-mono"
        fontSize="11" fontWeight="700" fill={COLS.Female} style={{ letterSpacing: ".14em" }}>
        WOMEN
      </text>
    </svg>
  );
}