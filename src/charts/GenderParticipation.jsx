import { useMemo } from "react";
import data from "../data/gender_year.json";
import { scaleLinear } from "../lib/chart";

const W = 900, H = 360;
const M = { t: 30, r: 24, b: 52, l: 62 };

const YEARS = Array.from(
  { length: 2026 - 2012 + 1 },
  (_, i) => 2012 + i
);

const formatN = (n) => n.toLocaleString();

export default function GenderParticipation() {
  const {
    series,
    sx,
    sy,
    yMax,
  } = useMemo(() => {
    const genders = [...new Set(data.map((d) => d.gender))];

    const series = genders.map((gender) => ({
      gender,
      values: data
        .filter((d) => d.gender === gender)
        .map((d) => ({
          year: Number(d.year),
          n: Number(d.n),
        }))
        .sort((a, b) => a.year - b.year),
    }));

    const yRaw = Math.max(...data.map((d) => Number(d.n)));

    // Round upward to a clean 500.
    const yMax = Math.ceil(yRaw / 500) * 500;

    return {
      series,
      yMax,
      sx: scaleLinear(
        [2012, 2026],
        [M.l, W - M.r]
      ),
      sy: scaleLinear(
        [0, yMax],
        [H - M.b, M.t]
      ),
    };
  }, []);

  const yStep =
    yMax > 10000 ? 2000 :
    yMax > 5000 ? 1000 :
    500;

  const yTicks = [];
  for (let v = 0; v <= yMax; v += yStep) {
    yTicks.push(v);
  }

  const genderColor = (gender) => {
    const g = String(gender).toLowerCase();

    if (g.startsWith("f")) return "var(--color-signal)";
    return "var(--color-ink)";
  };

  /*
   * Split each gender into uninterrupted year sequences.
   * e.g.
   *
   * 2017, 2018, 2021, 2022
   *
   * becomes:
   *
   * [2017, 2018]
   * [2021, 2022]
   */
  const splitIntoRuns = (values) => {
    if (!values.length) return [];

    const runs = [[values[0]]];

    for (let i = 1; i < values.length; i++) {
      const current = values[i];
      const previous = values[i - 1];

      if (current.year === previous.year + 1) {
        runs[runs.length - 1].push(current);
      } else {
        runs.push([current]);
      }
    }

    return runs;
  };

  const linePath = (values) =>
    values
      .map((d, i) =>
        `${i === 0 ? "M" : "L"} ${sx(d.year)} ${sy(d.n)}`
      )
      .join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block w-full h-auto overflow-visible"
    >
      {/* horizontal rules */}
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
            {formatN(v)}
          </text>
        </g>
      ))}

    {/* lines */}
    {series.map((s) => (
      <path
        key={s.gender}
        d={linePath(s.values)}
        fill="none"
        stroke={genderColor(s.gender)}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    ))}

      {/* points */}
      {series.map((s) =>
        s.values.map((d) => (
          <circle
            key={`${s.gender}-${d.year}`}
            cx={sx(d.year)}
            cy={sy(d.n)}
            r="3.5"
            fill={genderColor(s.gender)}
          />
        ))
      )}

      {/* x axis */}
      {YEARS.map((year) => (
        <text
          key={year}
          x={sx(year)}
          y={H - M.b + 18}
          textAnchor="middle"
          className="font-mono"
          fontSize="10"
          fill="var(--color-graphite)"
        >
          {year}
        </text>
      ))}

      {/* y axis label */}
      <text
        x={15}
        y={M.t + (H - M.t - M.b) / 2}
        textAnchor="middle"
        transform={`rotate(-90 15 ${M.t + (H - M.t - M.b) / 2})`}
        className="font-mono"
        fontSize="10.5"
        fill="var(--color-ink)"
        style={{ letterSpacing: ".12em" }}
      >
        NUMBER OF RUNNERS
      </text>

      {/* inline legend */}
      <g transform={`translate(${M.l + 8}, ${M.t})`}>
        {series.map((s, i) => (
          <g
            key={s.gender}
            transform={`translate(${i * 105}, 0)`}
          >
            <line
              x1="0"
              x2="18"
              y1="0"
              y2="0"
              stroke={genderColor(s.gender)}
              strokeWidth="2"
            />
            <circle
              cx="9"
              cy="0"
              r="3"
              fill={genderColor(s.gender)}
            />
            <text
              x="25"
              y="3.5"
              className="font-mono"
              fontSize="10.5"
              fill="var(--color-graphite)"
            >
              {s.gender}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}