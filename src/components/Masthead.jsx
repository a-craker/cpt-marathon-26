export default function Masthead() {
  return (
    <header className="border-b border-rule py-4 mb-14">
      <div className="max-w-[1060px] mx-auto px-6 flex justify-between items-baseline gap-4 flex-wrap">
        <div className="font-display font-extrabold text-[13px] tracking-[.22em] uppercase">
          Aidan Craker
        </div>
        <div className="font-mono text-[11.5px] text-graphite tracking-[.06em]">
          Race Analysis · Cape Town · May 2026
        </div>
      </div>
    </header>
  );
}