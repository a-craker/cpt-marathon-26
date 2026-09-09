import { useMemo } from "react";
import bandSeg from "../data/band_seg.json";

const W = 900, H = 320;
const M = { t: 34, r: 20, b: 44, l: 84 };

// lerp between two hex colours
const lerp = (a, b, t) => {
  const p = (h, i) => parseInt(h.slice(i, i + 2), 16);
  const c = (i) => Math.round(p(a, i) + (p(b, i) - p(a, i)) * t);
  return `rgb(${c(1)},${c(3)},${c(5)})`;
};
const col = (dev) => {
  const t = Math.max(-1, Math.min(1, dev / 0.2));
  return t < 0 ? lerp("#F3F5F7", "#14548F", -t) : lerp("#F3F5F7", "#BF3A18", t);
};

export default function PaceHeatmap() {
  const { bands, segs, grid } = useMemo(() => {
    const bands = [...new Set(bandSeg.map((d) => d.band))];
    const seen = new Map();
    for (const d of bandSeg) if (!seen.has(d.mid_km)) seen.set(d.mid_km, d.label);
    const segs = [...seen.entries()].sort((a, b) => a[0] - b[0]).map(([, l]) => l);
    const grid = bands.map((band) =>
      bandSeg
        .filter((d) => d.band === band)
        .sort((a, b) => a.mid_km - b.mid_km)
        .map((d) => d.norm - 1)
    );
    return { bands, segs, grid };
  }, []);

  const iw = W - M.l - M.r, ih = H - M.t - M.b;
  const cw = iw / segs.length, ch = ih / bands.length;

  const LW = 200, lx = M.l + iw - LW, ly = H - 26;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto overflow-visible">
      {grid.map((row, b) =>
        row.map((dev, i) => (
          <g key={`${b}-${i}`}>
            <rect x={M.l + i * cw} y={M.t + b * ch}
              width={cw - 1.5} height={ch - 1.5} fill={col(dev)} />
            <text x={M.l + i * cw + cw / 2} y={M.t + b * ch + ch / 2 + 3.5}
              textAnchor="middle" className="font-mono" fontSize="13.5" fontWeight="500"
              fill={Math.abs(dev) > 0.10 ? "#F3F5F7" : "var(--color-ink)"}>
              {`${Math.round(dev * 100)}%`}
            </text>
          </g>
        ))
      )}

      {/* row / column labels */}
      {bands.map((b, i) => (
        <text key={b} x={M.l - 12} y={M.t + i * ch + ch / 2 + 3.5} textAnchor="end"
          className="font-mono" fontSize="10.5" fontWeight="600" fill="var(--color-ink)">
          {b}
        </text>
      ))}
      {segs.map((lb, i) => (
        <text key={lb} x={M.l + i * cw + cw / 2} y={M.t - 11} textAnchor="middle"
          className="font-mono" fontSize="10.5" fill="var(--color-graphite)">
          {lb}
        </text>
      ))}
      <text x={M.l - 12} y={M.t - 11} textAnchor="end" className="font-mono"
        fontSize="10.5" fill="var(--color-graphite)" style={{ letterSpacing: ".12em" }}>
        BAND
      </text>

      {/* legend gradient */}
      {Array.from({ length: 40 }, (_, i) => (
        <rect key={i} x={lx + (i * LW) / 40} y={ly} width={LW / 40 + 0.5} height="9"
          fill={col(-0.2 + (i / 39) * 0.4)} />
      ))}
      <text x={lx - 9} y={ly + 8} textAnchor="end" className="font-mono"
        fontSize="10.5" fill="var(--color-graphite)">−20%</text>
      <text x={lx + LW + 9} y={ly + 8} className="font-mono"
        fontSize="10.5" fill="var(--color-graphite)">+20%</text>
      <text x={M.l} y={ly + 8} className="font-mono" fontSize="10.5"
        fill="var(--color-graphite)">Deviation from own average pace</text>
    </svg>
  );
}