import { useMemo } from "react";
import hero from "../data/hero.json";
import bandSeg from "../data/band_seg.json";
import { scaleLinear, line, BAND_COLS } from "../lib/chart";

const W = 1060, H = 420;
const M = { t: 24, r: 90, b: 40, l: 52 };
const HIGHLIGHT = ["sub 3:00", "5:00+"];

export default function HeroSpaghetti() {
  const { paths, bandPaths, sx, sy, y0, y1 } = useMemo(() => {
    const xs = hero.map((d) => d.mid_km);
    const x0 = Math.min(...xs), x1 = Math.max(...xs);
    const y0 = 0.8, y1 = 1.4; // clamp domain; tune to your data

    const sx = scaleLinear([x0, x1], [M.l, W - M.r]);
    const sy = scaleLinear([y0, y1], [H - M.b, M.t]);

    // group rows by bib
    const byBib = new Map();
    for (const d of hero) {
      if (!byBib.has(d.bib)) byBib.set(d.bib, []);
      byBib.get(d.bib).push(d);
    }
    const clamp = (v) => Math.max(y0, Math.min(y1, v));
    const paths = [...byBib.values()].map((rows) =>
      line(rows.map((d) => [sx(d.mid_km), sy(clamp(d.norm))]))
    );

    const bandPaths = HIGHLIGHT.map((band) => {
      const rows = bandSeg.filter((d) => d.band === band);
      return {
        band,
        pts: line(rows.map((d) => [sx(d.mid_km), sy(d.norm)])),
        last: rows[rows.length - 1],
      };
    });

    return { paths, bandPaths, sx, sy, y0, y1 };
  }, []);

  const yTicks = [0.9, 1, 1.1, 1.2, 1.3];
  const xTicks = [...new Set(bandSeg.map((d) => [d.mid_km, d.label].join("|")))]
    .map((s) => { const [km, label] = s.split("|"); return { km: +km, label }; });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto overflow-visible">
      {/* gridlines + y labels */}
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={M.l} x2={W - M.r} y1={sy(v)} y2={sy(v)}
            stroke={v === 1 ? "var(--color-ink)" : "var(--color-rule)"}
            strokeWidth={v === 1 ? 1.2 : 0.6}
            strokeDasharray={v === 1 ? "" : "2 4"} />
            <text x={M.l - 8} y={sy(v) + 3.5} textAnchor="end"
              className="font-mono" fontSize="10.5"
              fontWeight={v === 1 ? 700 : 400}
              fill={v === 1 ? "var(--color-ink)" : "var(--color-graphite)"}>
              {v === 1 ? "avg" : `${v > 1 ? "+" : "−"}${Math.round(Math.abs(v - 1) * 100)}%`}
            </text>
        </g>
      ))}

      {/* spaghetti */}
      {paths.map((p, i) => (
        <polyline key={i} points={p} fill="none"
          stroke="var(--color-ink)" strokeWidth="0.6" opacity="0.07" />
      ))}

      {/* highlighted band means */}
      {(() => {
        const labels = bandPaths
          .map(({ band, last }) => ({ band, y: sy(last.norm), x: sx(last.mid_km) }))
          .sort((a, b) => a.y - b.y);
        for (let i = 1; i < labels.length; i++) {
          if (labels[i].y - labels[i - 1].y < 16) {
            labels[i - 1].y -= 8;
            labels[i].y = labels[i - 1].y + 16;
          }
        }
        const pos = Object.fromEntries(labels.map((l) => [l.band, l]));
      
        return bandPaths.map(({ band, pts }) => (
          <g key={band}>
            <polyline points={pts} fill="none" stroke={BAND_COLS[band]}
              strokeWidth="2.6" strokeLinejoin="round" />
            <text x={pos[band].x + 10} y={pos[band].y + 4}
              className="font-mono" fontSize="11" fontWeight="700" fill={BAND_COLS[band]}>
              {band}
            </text>
          </g>
        ));
      })()}

      {/* x labels */}
      {xTicks.map(({ km, label }) => (
        <text key={km} x={sx(km)} y={H - M.b + 18} textAnchor="middle"
          className="font-mono" fontSize="10.5" fill="var(--color-graphite)">
          {label}
        </text>
      ))}
    </svg>
  );
}