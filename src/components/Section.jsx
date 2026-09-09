export default function Section({ id, num, title, children }) {
  return (
    <section id={id} className="mb-20 scroll-mt-6">
      <div className="flex gap-4 items-baseline border-t-2 border-ink pt-3.5 mb-6">
        <span className="font-mono text-xs font-semibold tracking-[.1em] text-flare pt-1.5">
          {num}
        </span>
        <h2 className="font-display font-bold text-[clamp(25px,3.6vw,36px)] leading-tight tracking-tight">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}