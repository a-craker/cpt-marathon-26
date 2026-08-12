import { useMemo, useState } from "react";
import bandSeg from "../data/band_seg.json";
import { scaleLinear, line, BAND_COLS } from "../lib/chart";

const W = 900, H = 400;
const M = { t: 24, r: 132, b: 50, l: 56 };

const fmtMS = (sec) => {
  const m = Math.floor(sec / 60), s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

export default function SegmentByBand() {
  const [mode, setMode] = useState("norm"); // "norm" | "pace"

  const bands = useMemo(
    () => [...new Set(bandSeg.map((d) => d.band))],
    []
  );
  const segs = useMemo(() => {
    const seen = new Map();
    for (const d of bandSeg) if (!seen.has(d.mid_km)) seen.set(d.mid_km, d.label);
    return [...seen.entries()].sort((a, b) => a[0] - b[0]);
  }, []);

  const { seriesData, sx, sy, yTicks } = useMemo(() => {
    const vals = bandSeg.map((d) => d[mode]);
    const pad = mode === "norm" ? 0.02 : 15;
    const y0 = Math.min(...vals) - pad;
    const y1 = Math.max(...vals) + pad;

    const kms = segs.map(([km]) => km);
    const sx = scaleLinear([Math.min(...kms), Math.max(...kms)], [M.l, W - M.r]);
    const sy = scaleLinear([y0, y1], [H - M.b, M.t]);

    const seriesData = bands.map((band) => {
      const rows = bandSeg
        .filter((d) => d.band === band)
        .sort((a, b) => a.mid_km - b.mid_km);
      return {
        band,
        rows,
        pts: line(rows.map((d) => [sx(d.mid_km), sy(d[mode])])),
        last: rows[rows.length - 1],
      };
    });

    const yTicks = [];
    if (mode === "norm") {
      for (let v = Math.ceil(y0 * 20) / 20; v <= y1; v += 0.05) yTicks.push(+v.toFixed(2));
    } else {
      for (let v = Math.ceil(y0 / 60) * 60; v <= y1; v += 60) yTicks.push(v);
    }

    return { seriesData, sx, sy, yTicks };
  }, [mode, bands, segs]);

  // spread right-edge labels apart
  const labels = seriesData
    .map(({ band, last }) => ({ band, y: sy(last[mode]) }))
    .sort((a, b) => a.y - b.y);
  for (let i = 1; i < labels.length; i++)
    if (labels[i].y - labels[i - 1].y < 15) labels[i].y = labels[i - 1].y + 15;
  const labelY = Object.fromEntries(labels.map((l) => [l.band, l.y]));

  return (
    <div>
      <div className="flex gap-2 items-center flex-wrap mb-3.5">
        {[["norm", "Normalised"], ["pace", "Actual pace"]].map(([m, lbl]) => (
          <button key={m} onClick={() => setMode(m)} aria-pressed={mode === m}
            className={`font-mono text-[11px] tracking-[.08em] uppercase px-3 py-1.5 border cursor-pointer transition rounded-none
              ${mode === m
                ? "bg-ink border-ink text-paper"
                : "bg-transparent border-rule text-graphite hover:border-ink hover:text-ink"}`}>
            {lbl}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto overflow-visible">
        {/* 30–40km shaded zone */}
        <rect x={sx(32.5) - (sx(32.5) - sx(27.5)) / 2} y={M.t}
          width={sx(37.5) - sx(27.5)} height={H - M.t - M.b}
          fill="var(--color-ink)" opacity="0.05" />

        {yTicks.map((v) => (
          <g key={v}>
            <line x1={M.l} x2={W - M.r} y1={sy(v)} y2={sy(v)}
              stroke={mode === "norm" && v === 1 ? "var(--color-ink)" : "var(--color-rule)"}
              strokeWidth={mode === "norm" && v === 1 ? 1.2 : 0.6} />
            <text x={M.l - 8} y={sy(v) + 3.5} textAnchor="end"
              className="font-mono" fontSize="10.5"
              fontWeight={mode === "norm" && v === 1 ? 700 : 400}
              fill={mode === "norm" && v === 1 ? "var(--color-ink)" : "var(--color-graphite)"}>
              {mode === "norm" ? `${Math.round(v * 100)}%` : fmtMS(v)}
            </text>
          </g>
        ))}

        {seriesData.map(({ band, rows, pts }) => (
          <g key={band}>
            <polyline points={pts} fill="none" stroke={BAND_COLS[band] ?? "var(--color-ink)"}
              strokeWidth="1.8" strokeLinejoin="round" />
            {rows.map((d) => (
              <circle key={d.mid_km} cx={sx(d.mid_km)} cy={sy(d[mode])} r="2.4"
                fill={BAND_COLS[band] ?? "var(--color-ink)"} />
            ))}
            <text x={W - M.r + 10} y={labelY[band] + 4}
              className="font-mono" fontSize="11" fontWeight="700"
              fill={BAND_COLS[band] ?? "var(--color-ink)"}>
              {band}
            </text>
          </g>
        ))}

        {segs.map(([km, label]) => (
          <text key={km} x={sx(km)} y={H - M.b + 18} textAnchor="middle"
            className="font-mono" fontSize="10.5" fill="var(--color-graphite)">
            {label}
          </text>
        ))}
        <text x={M.l + (W - M.l - M.r) / 2} y={H - 4} textAnchor="middle"
          className="font-mono" fontSize="10.5" fill="var(--color-ink)"
          style={{ letterSpacing: ".14em" }}>
          {mode === "norm" ? "% OF OWN AVERAGE PACE" : "SEGMENT PACE, MIN/KM"}
        </text>
      </svg>
    </div>
  );
}