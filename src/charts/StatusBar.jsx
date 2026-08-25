import { useMemo } from "react";
import status from "../data/status.json";

const W = 900;
const BAR_Y = 6;
const BAR_H = 54;
const GAP = 2.5;   // paper showing between segments, in svg units

const STATUS_COLS = {
  Finished: "#14548F",
  DNF: "#C86A34",
  DNS: "#7E9E9E",
};

const comma = (n) => n.toLocaleString("en-ZA").replace(/\u00a0/g, ",");
const pct = (x) => `${(x * 100).toFixed(1)}%`;

export default function StatusBar() {
  const { segs, total } = useMemo(() => {
    const total = status.reduce((a, d) => a + d.n, 0);
    let x = 0;
    const segs = status.map((d, i) => {
      const w = (d.n / total) * W;
      const seg = {
        ...d,
        x,
        // the gap eats into every segment but the last, so the bar still
        // ends flush at W
        w: Math.max(0, w - (i < status.length - 1 ? GAP : 0)),
        share: d.share ?? d.n / total,
      };
      x += w;
      return seg;
    });
    return { segs, total };
  }, []);

  const H = BAR_Y + BAR_H + 6;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto overflow-visible">
        {segs.map((s) => (
          <g key={s.finish_status}>
            <rect
              x={s.x}
              y={BAR_Y}
              width={s.w}
              height={BAR_H}
              fill={STATUS_COLS[s.finish_status] ?? "var(--color-ink)"}
            />
            {s.w > 74 && (
              <text
                x={s.x + s.w / 2}
                y={BAR_Y + BAR_H / 2 + 4.5}
                textAnchor="middle"
                className="font-mono"
                fontSize="12.5"
                fontWeight="700"
                fill="var(--color-paper)"
              >
                {pct(s.share)}
              </text>
            )}
          </g>
        ))}
      </svg>

      <div className="grid grid-cols-3 gap-x-7 gap-y-6 mt-6">
        {segs.map((s) => (
          <div key={s.finish_status}>
            <div
              className="h-[3px] mb-2.5"
              style={{ background: STATUS_COLS[s.finish_status] ?? "var(--color-ink)" }}
            />
            <div className="font-mono text-[10px] tracking-[.16em] uppercase text-graphite">
              {s.finish_status}
            </div>
            <div className="font-display font-extrabold text-[27px] leading-[1.08] tracking-[-.02em] mt-1.5">
              {comma(s.n)}
            </div>
            <div className="font-mono text-[11px] text-graphite mt-1">
              {pct(s.share)} of {comma(total)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}