export default function Figure({ title, meta, caption, children }) {
  return (
    <figure className="my-8 max-w-[900px]">
      <div className="border-b border-rule pb-2 mb-4 flex justify-between items-baseline gap-4 flex-wrap">
        <span className="font-display font-bold text-[14.5px]">{title}</span>
        {meta && (
          <span className="font-mono text-[10.5px] tracking-[.1em] uppercase text-graphite">
            {meta}
          </span>
        )}
      </div>
      {children}
      {caption && (
        <figcaption className="font-mono text-[11.5px] leading-relaxed text-graphite mt-3 max-w-[70ch]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}