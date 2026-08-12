import { fmtHMS, pct } from "../lib/format";
import summary from "../data/summary.json";

const stats = [
  [summary.finishers.toLocaleString(), "Finishers"],
  [fmtHMS(summary.median_sec), "Median finish"],
  [pct(summary.neg_split), "Negative split"],
  [`${summary.fade_km} km`, "Median fade point"],
];

export default function StatStrip() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-rule border-y border-rule mb-20">
      {stats.map(([val, label]) => (
        <div key={label} className="bg-paper px-4 py-5">
          <b className="block font-display font-bold text-[clamp(24px,3.4vw,34px)] tracking-tight leading-none">
            {val}
          </b>
          <span className="block font-mono text-[10.5px] tracking-[.12em] uppercase text-graphite mt-2">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}