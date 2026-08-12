import { useMemo } from "react";
import data from "../data/diff_by_band.json";
import { scaleLinear, BAND_COLS } from "../lib/chart";

const W = 900;
const M = { t: 10, r: 110, b: 46, l: 46 };
const FH = 74;   // height of each facet
const GAP = 8;   // gap between facets

export default function PositiveSplitByBand() {
  const { bands, byBand, sx, x0, x1, yMax } = useMemo(() => {
    const bands = [...new Set(data.map((d) => d.band))];
    const byBand = Object.fromEntries(
      bands.map((b) => [b, data.filter((d) => d.band === b)])
    );
    const x0 = -15, x1 = 60; // minutes, matches your R limits
    const sx = scaleLinear([x0, x1], [M.l, W - M.r]);
    const yMax = Math.max(...data.map((d) => d.n)); // shared scale, like scales="fixed"
    return { bands, byBand, sx, x0, x1, yMax };
  }, []);

  const H = M.t + bands.length * (FH + GAP) - GAP + M.b;
  const xTicks = [];
  for (let v = -10; v <= 60; v += 10) xTicks.push(v);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto overflow-visible">
      {bands.map((band, bi) => {
        const top = M.t + bi * (FH + GAP);
        const sy = scaleLinear([0, yMax], [top + FH, top]);
        const colr = BAND_COLS[band] ?? "var(--color-ink)";
        return (
          <g key={band}>
            {/* baseline */}
            <line x1={M.l} x2={W - M.r} y1={top + FH} y2={top + FH}
              stroke="var(--color-rule)" strokeWidth="0.6" />
            {/* bars */}
            {byBand[band].map((d) => (
              <rect key={d.bin}
                x={sx(d.bin) + 0.3}
                y={sy(d.n)}
                width={Math.max(0.8, sx(d.bin + 1) - sx(d.bin) - 0.6)}
                height={top + FH - sy(d.n)}
                fill={colr} opacity="0.85" />
            ))}
            {/* zero line through the facet */}
            <line x1={sx(0)} x2={sx(0)} y1={top} y2={top + FH}
              stroke="var(--color-ink)" strokeWidth="1" />
            {/* band label, right */}
            <text x={W - M.r + 12} y={top + FH / 2 + 4}
              className="font-mono" fontSize="11" fontWeight="700" fill={colr}>
              {band}
            </text>
          </g>
        );
      })}

      {/* shared x axis */}
      {xTicks.map((v) => (
        <text key={v} x={sx(v)} y={H - M.b + 18} textAnchor="middle"
          className="font-mono" fontSize="10.5" fill="var(--color-graphite)">
          {(v > 0 ? "+" : "") + v}m
        </text>
      ))}
      <text x={sx(0)} y={M.t - 0} textAnchor="middle" className="font-mono"
        fontSize="10.5" fill="var(--color-graphite)" />
      <text x={M.l + (W - M.l - M.r) / 2} y={H - 4} textAnchor="middle"
        className="font-mono" fontSize="10.5" fill="var(--color-ink)"
        style={{ letterSpacing: ".14em" }}>
        SECOND HALF − FIRST HALF
      </text>
    </svg>
  );
}