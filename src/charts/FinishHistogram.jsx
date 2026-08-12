import { useMemo } from "react";
import bins from "../data/finish_hist.json";
import summary from "../data/summary.json";
import { scaleLinear } from "../lib/chart";
import { fmtHM } from "../lib/format";

const W = 900, H = 340;
const M = { t: 26, r: 20, b: 48, l: 52 };
const BW = 300; // bin width in seconds

export default function FinishHistogram() {
  const { sx, sy, x0, x1, yMax } = useMemo(() => {
    const x0 = Math.min(...bins.map((d) => d.bin));
    const x1 = Math.max(...bins.map((d) => d.bin)) + BW;
    const yMax = Math.max(...bins.map((d) => d.n));
    return {
      x0, x1, yMax,
      sx: scaleLinear([x0, x1], [M.l, W - M.r]),
      sy: scaleLinear([0, yMax], [H - M.b, M.t]),
    };
  }, []);

  const yStep = yMax > 2000 ? 500 : 200;
  const yTicks = [];
  for (let v = 0; v <= yMax; v += yStep) yTicks.push(v);

  const xTicks = [];
  for (let t = Math.ceil(x0 / 1800) * 1800; t <= x1; t += 1800) xTicks.push(t);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto overflow-visible">
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={M.l} x2={W - M.r} y1={sy(v)} y2={sy(v)}
            stroke="var(--color-rule)" strokeWidth="0.6" />
          <text x={M.l - 8} y={sy(v) + 3.5} textAnchor="end"
            className="font-mono" fontSize="10.5" fill="var(--color-graphite)">
            {v.toLocaleString()}
          </text>
        </g>
      ))}

      {bins.map((d) => (
        <rect key={d.bin}
          x={sx(d.bin) + 0.5}
          y={sy(d.n)}
          width={Math.max(1, sx(d.bin + BW) - sx(d.bin) - 1)}
          height={sy(0) - sy(d.n)}
          fill="var(--color-ink)" opacity="0.55" />
      ))}

      {/* median marker */}
      <line x1={sx(summary.median_sec)} x2={sx(summary.median_sec)}
        y1={M.t - 6} y2={sy(0)}
        stroke="var(--color-signal)" strokeWidth="1.4" strokeDasharray="3 3" />
      <text x={sx(summary.median_sec) + 7} y={M.t + 6}
        className="font-mono" fontSize="11" fontWeight="700" fill="var(--color-signal)">
        median {fmtHM(summary.median_sec)}
      </text>

      {xTicks.map((t) => (
        <text key={t} x={sx(t)} y={H - M.b + 18} textAnchor="middle"
          className="font-mono" fontSize="10.5" fill="var(--color-graphite)">
          {fmtHM(t)}
        </text>
      ))}
      <text x={M.l + (W - M.l - M.r) / 2} y={H - 4} textAnchor="middle"
        className="font-mono" fontSize="10.5" fill="var(--color-ink)"
        style={{ letterSpacing: ".16em" }}>
        FINISH TIME
      </text>
    </svg>
  );
}