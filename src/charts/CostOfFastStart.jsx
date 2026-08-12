import { useMemo } from "react";
import aggr from "../data/aggr.json";
import { scaleLinear, line } from "../lib/chart";

const W = 900, H = 380;
const M = { t: 30, r: 28, b: 52, l: 58 };

export default function CostOfFastStart() {
  const { sx, sy, meanPts, ribbon, yTicks, xTicks } = useMemo(() => {
    const rows = [...aggr].sort((a, b) => a.bin - b.bin);

    const x0 = Math.min(...rows.map((d) => d.bin)) - 0.005;
    const x1 = Math.max(...rows.map((d) => d.bin)) + 0.005;
    const yLo = Math.floor(Math.min(...rows.map((d) => d.lo)) / 5) * 5;
    const yHi = Math.ceil(Math.max(...rows.map((d) => d.hi)) / 5) * 5;

    const sx = scaleLinear([x0, x1], [M.l, W - M.r]);
    const sy = scaleLinear([yLo, yHi], [H - M.b, M.t]);

    const meanPts = rows.map((d) => [sx(d.bin), sy(d.mean_diff)]);
    const up = rows.map((d) => `${sx(d.bin)},${sy(d.hi)}`);
    const dn = rows.map((d) => `${sx(d.bin)},${sy(d.lo)}`).reverse();

    const yTicks = [];
    for (let v = yLo; v <= yHi; v += 10) yTicks.push(v);
    const xTicks = [];
    for (let v = Math.ceil(x0 / 0.02) * 0.02; v <= x1; v += 0.02)
      xTicks.push(+v.toFixed(2));

    return { sx, sy, meanPts, ribbon: up.concat(dn).join(" "), yTicks, xTicks };
  }, []);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto overflow-visible">
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={M.l} x2={W - M.r} y1={sy(v)} y2={sy(v)}
            stroke={v === 0 ? "var(--color-ink)" : "var(--color-rule)"}
            strokeWidth={v === 0 ? 1.2 : 0.6}
            strokeDasharray={v === 0 ? "" : "2 4"} />
          <text x={M.l - 8} y={sy(v) + 3.5} textAnchor="end"
            className="font-mono" fontSize="10.5" fill="var(--color-graphite)">
            {(v > 0 ? "+" : "") + v}
          </text>
        </g>
      ))}
      <text x={M.l - 8} y={M.t - 12} textAnchor="end"
        className="font-mono" fontSize="10.5" fill="var(--color-graphite)">
        minutes
      </text>

      {/* IQR ribbon + mean line */}
      <polygon points={ribbon} fill="var(--color-signal)" opacity="0.14" />
      <polyline points={meanPts.map((p) => p.join(",")).join(" ")}
        fill="none" stroke="var(--color-signal)" strokeWidth="2.6" strokeLinejoin="round" />
      {meanPts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="var(--color-signal)" />
      ))}

      {/* even-pace reference line */}
      <line x1={sx(1)} x2={sx(1)} y1={M.t} y2={H - M.b}
        stroke="var(--color-ink)" strokeWidth="0.9" strokeDasharray="3 3" />
      <text x={sx(1) - 8} y={M.t + 14} textAnchor="end"
        className="font-mono" fontSize="11" fontWeight="500" fill="var(--color-ink)">
        opened at own average pace
      </text>
      <text x={sx(xTicks[0]) + 4} y={sy(yTicks[yTicks.length - 1] - 4)}
        className="font-mono" fontSize="11" fontWeight="500" fill="var(--color-flare)">
        faster start →
      </text>

      {xTicks.map((v) => {
        const pc = Math.round((1 - v) * 100);
        return (
          <text key={v} x={sx(v)} y={H - M.b + 18} textAnchor="middle"
            className="font-mono" fontSize="10.5" fill="var(--color-graphite)">
            {(pc > 0 ? "−" : pc < 0 ? "+" : "") + Math.abs(pc) + "%"}
          </text>
        );
      })}
      <text x={M.l + (W - M.l - M.r) / 2} y={H - 4} textAnchor="middle"
        className="font-mono" fontSize="10.5" fill="var(--color-ink)"
        style={{ letterSpacing: ".14em" }}>
        FIRST 5 KM PACE vs. OWN AVERAGE
      </text>
    </svg>
  );
}