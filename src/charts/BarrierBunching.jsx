import { useMemo } from "react";
import mins from "../data/mins.json";
import { scaleLinear } from "../lib/chart";
import { fmtHM } from "../lib/format";

const W = 900, H = 340;
const M = { t: 26, r: 20, b: 48, l: 52 };
const BARRIERS = [10800, 12600, 14400, 16200, 18000]; // 3:00 … 5:00

export default function BarrierBunching() {
  const { sx, sy, x0, x1, yMax, peak } = useMemo(() => {
    const x0 = Math.min(...mins.map((d) => d.bin));
    const x1 = Math.max(...mins.map((d) => d.bin)) + 60;
    const yMax = Math.max(...mins.map((d) => d.n));
    // tallest chase bar, for the callout
    const peak = mins.reduce(
      (best, d) => (d.chase && d.n > (best?.n ?? 0) ? d : best),
      null
    );
    return {
      x0, x1, yMax, peak,
      sx: scaleLinear([x0, x1], [M.l, W - M.r]),
      sy: scaleLinear([0, yMax], [H - M.b, M.t]),
    };
  }, []);

  const yStep = yMax > 400 ? 200 : 100;
  const yTicks = [];
  for (let v = 0; v <= yMax; v += yStep) yTicks.push(v);

  const bars = BARRIERS.filter((b) => b >= x0 && b <= x1);
  const xTicks = [];
  for (let t = Math.ceil(x0 / 600) * 600; t <= x1; t += 600) xTicks.push(t);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto overflow-visible">
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={M.l} x2={W - M.r} y1={sy(v)} y2={sy(v)}
            stroke="var(--color-rule)" strokeWidth="0.6" />
          <text x={M.l - 8} y={sy(v) + 3.5} textAnchor="end"
            className="font-mono" fontSize="10.5" fill="var(--color-graphite)">
            {v}
          </text>
        </g>
      ))}
      <text x={M.l - 8} y={M.t - 10} textAnchor="end"
        className="font-mono" fontSize="10.5" fill="var(--color-graphite)">
        runners
      </text>

      {/* barrier lines */}
      {bars.map((b) => (
        <g key={b}>
          <line x1={sx(b)} x2={sx(b)} y1={M.t - 8} y2={H - M.b}
            stroke="var(--color-ink)" strokeWidth="0.8" strokeDasharray="3 3" />
          <text x={sx(b)} y={M.t - 13} textAnchor="middle"
            className="font-mono" fontSize="11" fontWeight="500" fill="var(--color-ink)">
            {fmtHM(b)}
          </text>
        </g>
      ))}

      {/* bars */}
      {mins.map((d) => (
        <rect key={d.bin}
          x={sx(d.bin) + 0.4}
          y={sy(d.n)}
          width={Math.max(1, sx(d.bin + 60) - sx(d.bin) - 0.8)}
          height={sy(0) - sy(d.n)}
          fill={d.chase ? "var(--color-flare)" : "var(--color-ink)"}
          opacity={d.chase ? 0.95 : 0.55} />
      ))}

      {/* peak callout */}
      {peak && (
        <text x={sx(peak.bin) - 8} y={sy(peak.n) - 8} textAnchor="end"
          className="font-mono" fontSize="10.5" fill="var(--color-flare)">
          {peak.n} finishers in the minute before {fmtHM(peak.bin + 60)}
        </text>
      )}

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