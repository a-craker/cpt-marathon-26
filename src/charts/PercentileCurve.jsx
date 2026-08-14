import { useMemo, useRef, useState } from "react";
import pcts from "../data/percentiles.json";
import summary from "../data/summary.json";
import { scaleLinear, line } from "../lib/chart";
import { fmtHM } from "../lib/format";

const W = 900, H = 380;
const M = { t: 26, r: 30, b: 48, l: 46 };
const COLS = {
  All: "var(--color-ink)",
  Male: "var(--color-signal)",
  Female: "var(--color-flare)",
};
const BARRIERS = [10800, 12600, 14400, 16200, 18000]; // 3:00 … 5:00

const parseTime = (str) => {
  const m = str.trim().match(/^(\d+):(\d{1,2})(?::(\d{1,2}))?$/);
  if (!m) return null;
  return +m[1] * 3600 + +m[2] * 60 + (+m[3] || 0);
};

// seconds -> "h:mm:ss", so dragged values round-trip through parseTime
const fmtHMS = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.round(s % 60);
  return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

export default function PercentileCurve() {
  const [input, setInput] = useState("3:45:00");
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef(null);

  const { series, marks, sx, sy, x0, x1, pctAt } = useMemo(() => {
    const ts = pcts.map((d) => d.t);
    const x0 = Math.min(...ts), x1 = Math.max(...ts);
    const sx = scaleLinear([x0, x1], [M.l, W - M.r]);
    const sy = scaleLinear([0, 100], [H - M.b, M.t]);

    const series = Object.keys(COLS).map((g) => {
      const rows = pcts
        .filter((d) => d.gender === g)
        .sort((a, b) => a.pct - b.pct);
      return { g, pts: line(rows.map((d) => [sx(d.t), sy(d.pct)])), rows };
    });

    const all = series.find((s) => s.g === "All").rows;
    const pctAt = (t) => {
      if (t <= all[0].t) return all[0].pct;
      if (t >= all[all.length - 1].t) return all[all.length - 1].pct;
      for (let i = 1; i < all.length; i++)
        if (all[i].t >= t) {
          const a = all[i - 1], c = all[i];
          return a.pct + ((t - a.t) / (c.t - a.t)) * (c.pct - a.pct);
        }
      return 100;
    };

    const marks = BARRIERS.filter((b) => b >= x0 && b <= x1)
      .map((b) => ({ t: b, pct: pctAt(b) }));

    return { series, marks, sx, sy, x0, x1, pctAt };
  }, []);

  // derive finder state from input (unchanged — dragging writes into `input`)
  const t = parseTime(input);
  const inRange = t != null && t >= x0 && t <= x1;
  const userPct = inRange ? pctAt(t) : null;

  // --- drag handling -------------------------------------------------------
  // Inverse of sx: pointer clientX -> time in seconds, clamped to the domain.
  const clientToTime = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W; // viewBox units
    const frac = (px - M.l) / (W - M.l - M.r);
    const tt = x0 + frac * (x1 - x0);
    return Math.round(Math.max(x0, Math.min(x1, tt)));
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setInput(fmtHMS(clientToTime(e)));
  };
  const onPointerMove = (e) => {
    if (dragging) setInput(fmtHMS(clientToTime(e)));
  };
  const onPointerEnd = () => setDragging(false);
  // -------------------------------------------------------------------------

  let output;
  if (t == null) output = <small className="font-mono text-xs text-graphite">Use h:mm or h:mm:ss</small>;
  else if (!inRange) output = <small className="font-mono text-xs text-graphite">Outside the field's range</small>;
  else {
    const beat = (100 - userPct).toFixed(1);
    const place = Math.round((userPct / 100) * summary.finishers);
    output = (
      <>
        Beats {beat}% of the field{" "}
        <small className="font-mono font-normal text-xs text-graphite tracking-wide">
          · approx. place {place.toLocaleString()} of {summary.finishers.toLocaleString()}
        </small>
      </>
    );
  }

  const xTicks = [];
  for (let tk = Math.ceil(x0 / 3600) * 3600; tk <= x1; tk += 3600) xTicks.push(tk);

  return (
    <div>
      {/* finder */}
      <div className="border border-rule bg-card px-5 py-4 mb-5 flex gap-4 items-center flex-wrap max-w-[900px]">
        <label htmlFor="tin" className="font-mono text-[11px] tracking-[.12em] uppercase text-graphite">
          Your finish time
        </label>
        <input
          id="tin"
          type="text"
          inputMode="numeric"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="font-mono text-[15px] px-2.5 py-1.5 w-[120px] border border-rule bg-paper text-ink rounded-none focus-visible:outline-2 focus-visible:outline-flare"
        />
        <output htmlFor="tin" className="font-display font-bold text-[17px]">
          {output}
        </output>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="block w-full h-auto overflow-visible"
        style={{ touchAction: "none" }}
      >
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1={M.l} x2={W - M.r} y1={sy(v)} y2={sy(v)}
              stroke="var(--color-rule)" strokeWidth="0.6" />
            <text x={M.l - 8} y={sy(v) + 3.5} textAnchor="end"
              className="font-mono" fontSize="10.5" fill="var(--color-graphite)">
              {v}
            </text>
          </g>
        ))}

        {series.map(({ g, pts }) => (
          <polyline key={g} points={pts} fill="none" stroke={COLS[g]}
            strokeWidth={g === "All" ? 2.4 : 1.4}
            opacity={g === "All" ? 1 : 0.75} strokeLinejoin="round" />
        ))}

        {/* barrier markers with guide lines */}
        {marks.map(({ t: bt, pct }) => (
          <g key={bt}>
            <line x1={sx(bt)} x2={sx(bt)} y1={sy(pct)} y2={H - M.b}
              stroke="var(--color-graphite)" strokeWidth="0.7" strokeDasharray="2 3" />
            <line x1={M.l} x2={sx(bt)} y1={sy(pct)} y2={sy(pct)}
              stroke="var(--color-graphite)" strokeWidth="0.7" strokeDasharray="2 3" />
            <circle cx={sx(bt)} cy={sy(pct)} r="3.4" fill="var(--color-ink)" />
            <text x={sx(bt) + 7} y={sy(pct) - 7}
              className="font-mono" fontSize="10.5" fontWeight="500" fill="var(--color-ink)">
              {fmtHM(bt)} · {Math.round(pct)}th
            </text>
          </g>
        ))}

        {/* user marker */}
        {inRange && (
          <g pointerEvents="none">
            <line x1={sx(t)} x2={sx(t)} y1={M.t} y2={H - M.b}
              stroke="var(--color-vis)" strokeWidth="2" />
            <circle cx={sx(t)} cy={sy(userPct)} r={dragging ? 6.5 : 5}
              fill="var(--color-vis)" stroke="var(--color-ink)" strokeWidth="1.4" />
          </g>
        )}

        {/* legend */}
        {Object.entries(COLS).map(([g, c], i) => (
          <text key={g} x={M.l + 60 + i * 70} y={M.t - 10} className="font-mono"
            fontSize="11" fontWeight="700" fill={c} style={{ letterSpacing: ".1em" }}>
            {g.toUpperCase()}
          </text>
        ))}

        {xTicks.map((tk) => (
          <text key={tk} x={sx(tk)} y={H - M.b + 18} textAnchor="middle"
            className="font-mono" fontSize="10.5" fill="var(--color-graphite)">
            {fmtHM(tk)}
          </text>
        ))}
        <text x={M.l + (W - M.l - M.r) / 2} y={H - 4} textAnchor="middle"
          className="font-mono" fontSize="10.5" fill="var(--color-ink)"
          style={{ letterSpacing: ".16em" }}>
          FINISH TIME
        </text>

        {/* drag surface: press or drag anywhere in the plot to move the marker */}
        <rect
          x={M.l} y={M.t}
          width={W - M.l - M.r} height={H - M.t - M.b}
          fill="transparent"
          style={{ cursor: dragging ? "grabbing" : "ew-resize" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
        />
      </svg>
    </div>
  );
}