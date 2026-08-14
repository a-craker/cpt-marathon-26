import { useMemo, useState } from "react";
import data from "../data/country_finishers.json";

const flagModules = import.meta.glob("../data/flags/*.svg", {
  eager: true, query: "?url", import: "default",
});
const flagUrl = (iso3) =>
  flagModules[`../data/flags/${iso3.toLowerCase()}.svg`];

const PER_PAGE = 16;

export default function CountryFlagBars() {
  const [query, setQuery] = useState("");
  const [excludeRSA, setExcludeRSA] = useState(false);
  const [page, setPage] = useState(0);

  const rows = useMemo(() => {
    const q = query.trim().toUpperCase();
    return data
      .filter((d) => !(excludeRSA && d.country === "RSA"))
      .filter((d) => d.country.includes(q));
  }, [query, excludeRSA]);

  const pages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const safePage = Math.min(page, pages - 1);
  const visible = rows.slice(safePage * PER_PAGE, (safePage + 1) * PER_PAGE);
  const max = visible.length ? Math.max(...visible.map((d) => d.n)) : 1;

  return (
    <div className="mx-auto my-8 max-w-2xl">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search country code"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(0); }}
          className="min-w-44 flex-1 rounded-md border border-rule bg-card
                     px-3 py-1.5 font-mono text-sm text-ink
                     placeholder:text-graphite focus:border-signal
                     focus:outline-none"
        />
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={excludeRSA}
            onChange={(e) => { setExcludeRSA(e.target.checked); setPage(0); }}
            className="accent-signal"
          />
          Exclude South Africa
        </label>
        <span className="font-mono text-xs text-graphite">
          {rows.length} / {data.length}
        </span>
      </div>

      {visible.map((d) => (
        <div key={d.country} className="mb-1.5 flex items-center gap-2.5">
          <img
            src={flagUrl(d.iso3)}
            width={24}
            height={18}
            alt={`${d.country} flag`}
            className="flex-none rounded-xs object-cover"
          />
          <span className="w-8 flex-none text-right font-mono text-xs text-graphite tabular-nums">
            {d.rank}
          </span>
          <span className="w-11 flex-none font-mono text-xs font-medium text-ink">
            {d.country}
          </span>
          <div className="h-4 flex-1 overflow-hidden rounded-xs bg-card">
            <div
              className={d.country === "RSA" ? "h-full bg-flare" : "h-full bg-signal"}
              style={{ width: `${Math.max(0.5, (d.n / max) * 100)}%` }}
            />
          </div>
          <span className="w-16 flex-none text-right font-mono text-xs text-ink tabular-nums">
            {d.n.toLocaleString()}
          </span>
          <span className="w-13 flex-none text-right font-mono text-xs text-graphite tabular-nums">
            {d.pct}%
          </span>
        </div>
      ))}

      {rows.length === 0 && (
        <p className="text-sm text-graphite">No country matches that code.</p>
      )}

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage(Math.max(0, safePage - 1))}
            disabled={safePage === 0}
            className="rounded-md border border-rule px-3 py-1 font-mono text-xs
                       text-ink hover:bg-card disabled:opacity-40
                       disabled:hover:bg-transparent"
          >
            ←
          </button>
          <span className="font-mono text-xs text-graphite tabular-nums">
            {safePage + 1} / {pages}
          </span>
          <button
            onClick={() => setPage(Math.min(pages - 1, safePage + 1))}
            disabled={safePage === pages - 1}
            className="rounded-md border border-rule px-3 py-1 font-mono text-xs
                       text-ink hover:bg-card disabled:opacity-40
                       disabled:hover:bg-transparent"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}