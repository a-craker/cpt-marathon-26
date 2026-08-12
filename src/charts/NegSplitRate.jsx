import { useMemo } from "react";
import negBand from "../data/neg_band.json";
import { scaleLinear } from "../lib/chart";

const W = 430, H = 300;
const M = { t: 26, r: 14, b: 46, l: 38 };
const COLS = { Male: "var(--color-signal)", Female: "var(--color-flare)" };

export default function NegSplitRate() {
  const { bands, rows, sy, yTicks } = useMemo(() => {
    const bands = [...new Set(negBand.map((d) => d.band))];
    const rows = bands.map((b) => ({
      band: b,
      Male: (negBand.find((d) => d.band === b && d.gender === "Male")?.rate ?? 0) * 100,
      Female: (negBand.find((d) => d.band === b && d.gender === "Female")?.rate ?? 0) * 100,
    }));
    const max = Math.max(...rows.flatMap((r) => [r.Male, r.Female])) * 1.15;
    const sy = scaleLinear([0, max], [H - M.b, M.t]);
    const step = max > 15 ? 10 : 5;
    const yTicks = [];
    for (let v = 0; v <= max; v += step) yTicks.push(v);
    return { bands, rows, sy, yTicks };
  }, []);

  const iw = W - M.l - M.r;
  const gw = iw / rows.length;
  const bw = gw * 0.34;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto overflow-visible">
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={M.l} x2={W - M.r} y1={sy(v)} y2={sy(v)}
            stroke="var(--color-rule)" strokeWidth="0.6" />
          <text x={M.l - 7} y={sy(v) + 3.5} textAnchor="end"
            className="font-mono" fontSize="10.5" fill="var(--color-graphite)">
            {v}%
          </text>
        </g>
      ))}

      {rows.map((r, i) => {
        const x = M.l + i * gw + gw / 2;
        return (
          <g key={r.band}>
            {[["Male", -bw - 1], ["Female", 1]].map(([g, off]) => (
              <g key={g}>
                <rect x={x + off} y={sy(r[g])} width={bw}
                  height={sy(0) - sy(r[g])} fill={COLS[g]} opacity="0.85" />
                <text x={x + off + bw / 2} y={sy(r[g]) - 5} textAnchor="middle"
                  className="font-mono" fontSize="10.5" fontWeight="500" fill={COLS[g]}>
                  {r[g].toFixed(0)}
                </text>
              </g>
            ))}
            <text x={x} y={H - 24} textAnchor="middle"
              className="font-mono" fontSize="10.5" fill="var(--color-graphite)">
              {r.band.replace("sub ", "<")}
            </text>
          </g>
        );
      })}

      <text x={M.l} y={M.t - 8} className="font-mono" fontSize="11"
        fontWeight="700" fill={COLS.Male} style={{ letterSpacing: ".14em" }}>
        MEN
      </text>
      <text x={M.l + 44} y={M.t - 8} className="font-mono" fontSize="11"
        fontWeight="700" fill={COLS.Female} style={{ letterSpacing: ".14em" }}>
        WOMEN
      </text>
      <text x={M.l + iw / 2} y={H - 4} textAnchor="middle"
        className="font-mono" fontSize="10.5" fill="var(--color-ink)"
        style={{ letterSpacing: ".12em" }}>
        FINISHING BAND
      </text>
    </svg>
  );
}