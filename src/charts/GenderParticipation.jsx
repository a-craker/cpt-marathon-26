import { useMemo } from "react";
import data from "../data/gender_year.json";
import { scaleLinear } from "../lib/chart";

const W = 900, H = 360;
const M = { t: 30, r: 24, b: 52, l: 62 };

const YEARS = Array.from(
  { length: 2026 - 2012 + 1 },
  (_, i) => 2012 + i
);

const YEAR_NOTES = {
  2019: "MISSING DATA",
  2020: "COVID",
  2025: "CANCELLED",
};

const formatN = (n) => n.toLocaleString();

export default function GenderParticipation() {
  const {
    series,
    sx,
    sy,
    yMax,
  } = useMemo(() => {
    const genders = [
      ...new Set(data.map((d) => d.gender)),
    ];

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

    const yRaw = Math.max(
      ...data.map((d) => Number(d.n))
    );

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

  const plotH = H - M.t - M.b;

  const yearStep =
    (W - M.l - M.r) /
    (YEARS.length - 1);

  const yStep =
    yMax > 10000
      ? 2000
      : yMax > 5000
        ? 1000
        : 500;

  const yTicks = [];

  for (let v = 0; v <= yMax; v += yStep) {
    yTicks.push(v);
  }

  const genderColor = (gender) => {
    const g = String(gender).toLowerCase();

    if (g.startsWith("f")) {
      return "var(--color-signal)";
    }

    return "var(--color-ink)";
  };

  const linePath = (values) =>
    values
      .map(
        (d, i) =>
          `${i === 0 ? "M" : "L"} ${sx(
            d.year
          )} ${sy(d.n)}`
      )
      .join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block w-full h-auto overflow-visible"
    >
      {/* Grey backgrounds for exceptional / missing years */}
      {YEARS.map((year) => {
        if (!YEAR_NOTES[year]) return null;

        return (
          <rect
            key={`background-${year}`}
            x={sx(year) - yearStep / 2}
            y={M.t}
            width={yearStep}
            height={plotH}
            fill="var(--color-graphite)"
            opacity="0.07"
          />
        );
      })}

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

      {/* continuous lines */}
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

      {/* Vertical annotations */}
      {YEARS.map((year) => {
        const note = YEAR_NOTES[year];

        if (!note) return null;

        const x = sx(year);
        const y = M.t + plotH / 2;

        return (
          <text
            key={`annotation-${year}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(-90 ${x} ${y})`}
            className="font-mono"
            fontSize="8.5"
            fontWeight="600"
            fill="var(--color-graphite)"
            opacity="0.65"
            style={{
              letterSpacing: ".08em",
            }}
          >
            {note}
          </text>
        );
      })}

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
        y={M.t + plotH / 2}
        textAnchor="middle"
        transform={`rotate(
          -90
          15
          ${M.t + plotH / 2}
        )`}
        className="font-mono"
        fontSize="10.5"
        fill="var(--color-ink)"
        style={{
          letterSpacing: ".12em",
        }}
      >
        NUMBER OF RUNNERS
      </text>

      {/* inline legend */}
      <g
        transform={`translate(
          ${M.l + 8},
          ${M.t}
        )`}
      >
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