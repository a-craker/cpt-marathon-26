import { useId, useMemo } from "react";
import census from "../data/census.json";
import { BAND_COLS } from "../lib/chart";

const PITCH = 5;    // dot cell, in svg units
const DOT = 2.8;    // dot itself - the 1.8 difference is the gutter
const HEAD = 58;    // headroom above the grid for the three stacked labels
const M = { t: 10, r: 12, b: 12, l: 12 };
const MARK = "var(--color-flare)";

const fmtHMS = (sec) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.round(sec % 60);
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export default function CensusGrid() {
  const { cols, n, bands, runs, marks: rawMarks } = census;
  const uid = useId().replace(/:/g, "");

  const { rects, marks, W, H, gridY0 } = useMemo(() => {
    const nRows = Math.ceil(n / cols);
    const gridY0 = M.t + HEAD;
    const W = M.l + cols * PITCH + M.r;
    const H = gridY0 + nRows * PITCH + M.b;

    // Each run is a contiguous block of one band. Split it at row boundaries
    // so every piece is a single horizontal strip one cell tall.
    const rects = [];
    for (const { band, start, len } of runs) {
      let i = start;
      let left = len;
      while (left > 0) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const take = Math.min(cols - col, left);
        rects.push({
          key: `${band}-${i}`,
          band,
          x: M.l + col * PITCH,
          y: gridY0 + row * PITCH,
          w: take * PITCH,
        });
        i += take;
        left -= take;
      }
    }

    // All three marks land in the top row, so the labels stack. Giving the
    // rightmost mark the line closest to the grid means no leader line ever
    // has to cross a label sitting above it.
    const marks = rawMarks
      .map((m) => ({
        ...m,
        cx: M.l + (m.idx % cols) * PITCH + PITCH / 2,
        cy: gridY0 + Math.floor(m.idx / cols) * PITCH + PITCH / 2,
      }))
      .sort((a, b) => b.cx - a.cx)
      .map((m, i) => ({ ...m, labY: gridY0 - 12 - i * 15 }));

    return { rects, marks, W, H, gridY0 };
  }, [cols, n, runs, rawMarks]);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto overflow-visible">
        <defs>
          {bands.map((b, i) => (
            <pattern
              key={b}
              id={`${uid}-${i}`}
              width={PITCH}
              height={PITCH}
              patternUnits="userSpaceOnUse"
              patternTransform={`translate(${M.l}, ${gridY0})`}
            >
            <circle
              cx={PITCH / 2}
              cy={PITCH / 2}
              r={DOT / 2}
              fill={BAND_COLS[b] ?? "var(--color-ink)"}
              opacity="0.88"
            />
            </pattern>
          ))}
        </defs>

        {rects.map((r) => (
          <rect
            key={r.key}
            x={r.x}
            y={r.y}
            width={r.w}
            height={PITCH}
            fill={`url(#${uid}-${r.band})`}
          />
        ))}

        {marks.map((m) => (
          <g key={m.role}>
            <line
              x1={m.cx}
              x2={m.cx}
              y1={m.cy - 5}
              y2={m.labY + 5}
              stroke={MARK}
              strokeWidth="0.8"
            />
            <circle cx={m.cx} cy={m.cy} r="4.5" fill="none" stroke={MARK} strokeWidth="1" />
            <text
              x={m.cx + 8}
              y={m.labY}
              className="font-mono"
              fontSize="11"
              fill={MARK}
            >
              {m.prefix}
              <tspan fill="var(--color-ink)"> · {m.name}</tspan>
              <tspan fill="var(--color-graphite)"> · {fmtHMS(m.finish_sec)}</tspan>
            </text>
          </g>
        ))}
      </svg>

      <div className="flex gap-4 items-center flex-wrap mt-3.5">
        {bands.map((b) => (
          <span key={b} className="flex gap-1.5 items-center">
            <span
              className="w-2 h-2 inline-block"
              style={{ background: BAND_COLS[b] ?? "var(--color-ink)" }}
            />
            <span className="font-mono text-[10.5px] text-graphite">{b}</span>
          </span>
        ))}
      </div>
    </div>
  );
}