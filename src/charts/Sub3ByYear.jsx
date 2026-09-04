import { useMemo } from "react";
import data from "../data/sub3_by_year.json";
import { scaleLinear } from "../lib/chart";

const W = 900, H = 370;
const M = { t: 34, r: 20, b: 52, l: 58 };

const YEARS = Array.from(
  { length: 2026 - 2012 + 1 },
  (_, i) => 2012 + i
);

const pct = (v) => `${(v * 100).toFixed(1)}%`;

export default function Sub3ByYear() {
  const { rows, sy, yMax } = useMemo(() => {
    const rows = YEARS.map((year) => ({
      year,
      values: data.filter((d) => Number(d.year) === year),
    }));

    const maxPct = Math.max(
      ...data.map((d) => Number(d.pct_sub3)),
      0
    );

    // Round up to a sensible whole percentage point.
    const yMax =
      Math.ceil((maxPct * 100 + 1) / 2) * 2 / 100;

    return {
      rows,
      yMax,
      sy: scaleLinear(
        [0, yMax],
        [H - M.b, M.t]
      ),
    };
  }, []);

  const plotW = W - M.l - M.r;
  const yearStep = plotW / YEARS.length;

  const groupW = Math.min(42, yearStep * 0.72);
  const gap = 3;
  const barW = (groupW - gap) / 2;

  const yStep =
    yMax <= 0.05 ? 0.01 :
    yMax <= 0.10 ? 0.02 :
    0.05;

  const yTicks = [];
  for (let v = 0; v <= yMax + 1e-9; v += yStep) {
    yTicks.push(v);
  }

  const isFemale = (gender) =>
    String(gender).toLowerCase().startsWith("f");

  const genderFill = (gender) =>
    isFemale(gender)
      ? "var(--color-signal)"
      : "var(--color-ink)";

  // Ensure consistent ordering within each year.
  const genderOrder = (gender) =>
    isFemale(gender) ? 1 : 0;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block w-full h-auto overflow-visible"
    >
      {/* grid + y axis */}
      {yTicks.map((v) => (
        <g key={v}>
          <line
            x1={M.l}
            x2={W - M.r}
            y1={sy(v)}
            y2={sy(v)}
            stroke="var(--color-rule)"
            strokeWidth="0.6"
          />

          <text
            x={M.l - 8}
            y={sy(v) + 3.5}
            textAnchor="end"
            className="font-mono"
            fontSize="10.5"
            fill="var(--color-graphite)"
          >
            {Math.round(v * 100)}%
          </text>
        </g>
      ))}

      {/* bars */}
      {rows.map((row, i) => {
        const cx =
          M.l +
          yearStep * i +
          yearStep / 2;

        const values = [...row.values].sort(
          (a, b) =>
            genderOrder(a.gender) -
            genderOrder(b.gender)
        );

        return (
          <g key={row.year}>
            {values.map((d, j) => {
              const x =
                cx -
                groupW / 2 +
                j * (barW + gap);

              const y = sy(d.pct_sub3);
              const height = sy(0) - y;

              return (
                <g key={`${row.year}-${d.gender}`}>
                  <rect
                    x={x}
                    y={y}
                    width={barW}
                    height={height}
                    fill={genderFill(d.gender)}
                    opacity={
                      isFemale(d.gender)
                        ? 0.9
                        : 0.58
                    }
                  />

                  <text
                    x={x + barW / 2}
                    y={y - 6}
                    textAnchor="middle"
                    className="font-mono"
                    fontSize="9.5"
                    fontWeight="700"
                    fill={genderFill(d.gender)}
                  >
                    {pct(d.pct_sub3)}
                  </text>
                </g>
              );
            })}

            {/* year label */}
            <text
              x={cx}
              y={H - M.b + 18}
              textAnchor="middle"
              className="font-mono"
              fontSize="10"
              fill="var(--color-graphite)"
            >
              {row.year}
            </text>
          </g>
        );
      })}

      {/* y-axis label */}
      <text
        x={15}
        y={M.t + (H - M.t - M.b) / 2}
        textAnchor="middle"
        transform={`rotate(
          -90 15 ${M.t + (H - M.t - M.b) / 2}
        )`}
        className="font-mono"
        fontSize="10.5"
        fill="var(--color-ink)"
        style={{ letterSpacing: ".12em" }}
      >
        % OF GENDER FINISHING SUB 3
      </text>

      {/* legend */}
      <g transform={`translate(${M.l + 8}, ${M.t - 15})`}>
        <g>
          <rect
            x="0"
            y="-7"
            width="10"
            height="10"
            fill="var(--color-ink)"
            opacity="0.58"
          />
          <text
            x="16"
            y="1"
            className="font-mono"
            fontSize="10.5"
            fill="var(--color-graphite)"
          >
            Male
          </text>
        </g>

        <g transform="translate(70, 0)">
          <rect
            x="0"
            y="-7"
            width="10"
            height="10"
            fill="var(--color-signal)"
            opacity="0.9"
          />
          <text
            x="16"
            y="1"
            className="font-mono"
            fontSize="10.5"
            fill="var(--color-graphite)"
          >
            Female
          </text>
        </g>
      </g>
    </svg>
  );
}