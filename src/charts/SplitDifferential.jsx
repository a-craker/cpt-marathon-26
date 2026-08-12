import { useMemo } from "react";
import bins from "../data/diff_hist.json";
import summary from "../data/summary.json";
import { scaleLinear } from "../lib/chart";

const W = 430, H = 300;
const M = { t: 22, r: 14, b: 46, l: 46 };
const BW = 150; // bin width, seconds

export default function SplitDifferential() {
  const { sx, sy, yMax } = useMemo(() => {
    const yMax = Math.max(...bins.map((d) => d.n));
    return {
      yMax,
      sx: scaleLinear([-900, 3600], [M.l, W - M.r]),
      sy: scaleLinear([0, yMax], [H - M.b, M.t]),
    };
  }, []);

  const yStep = yMax > 2000 ? 1000 : 500;
  const yTicks = [];
  for (let v = 0; v <= yMax; v += yStep) yTicks.push(v);

  const negPct = (summary.neg_split * 100).toFixed(1);
  const posPct = (100 - summary.neg_split * 100).toFixed(1);

  const xTicks = [];
  for (let t = -600; t <= 3600; t += 1200) xTicks.push(t);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto overflow-visible">
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={M.l} x2={W - M.r} y1={sy(v)} y2={sy(v)}
            stroke="var(--color-rule)" strokeWidth="0.6" />
          <text x={M.l - 7} y={sy(v) + 3.5} textAnchor="end"
            className="font-mono" fontSize="10.5" fill="var(--color-graphite)">
            {v >= 1000 ? `${v / 1000}k` : v}
          </text>
        </g>
      ))}

      {bins.filter((d) => d.bin >= -900 && d.bin < 3600).map((d) => (
        <rect key={d.bin}
          x={sx(d.bin) + 0.5}
          y={sy(d.n)}
          width={Math.max(1, sx(d.bin + BW) - sx(d.bin) - 1)}
          height={sy(0) - sy(d.n)}
          fill={d.bin < 0 ? "var(--color-signal)" : "var(--color-flare)"}
          opacity={d.bin < 0 ? 0.9 : 0.55} />
      ))}

      <line x1={sx(0)} x2={sx(0)} y1={M.t - 6} y2={sy(0)}
        stroke="var(--color-ink)" strokeWidth="1.4" />
      <text x={sx(0) - 7} y={M.t + 6} textAnchor="end"
        className="font-mono" fontSize="11" fontWeight="500" fill="var(--color-signal)">
        {negPct}% faster
      </text>
      <text x={sx(0) + 7} y={M.t + 6}
        className="font-mono" fontSize="11" fontWeight="500" fill="var(--color-flare)">
        {posPct}% slower
      </text>

      {xTicks.map((t) => (
        <text key={t} x={sx(t)} y={H - 18} textAnchor="middle"
          className="font-mono" fontSize="10.5" fill="var(--color-graphite)">
          {(t > 0 ? "+" : "") + t / 60}m
        </text>
      ))}
      <text x={M.l + (W - M.l - M.r) / 2} y={H - 3} textAnchor="middle"
        className="font-mono" fontSize="10.5" fill="var(--color-ink)"
        style={{ letterSpacing: ".12em" }}>
        SECOND HALF − FIRST HALF
      </text>
    </svg>
  );
}