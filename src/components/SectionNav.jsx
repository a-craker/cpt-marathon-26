import { useEffect, useState } from "react";

export default function SectionNav({ sections }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);

  const goTo = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) {
      console.warn(`SectionNav: no element with id "${id}"`);
      return;
    }
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  return (
    <nav
      aria-label="Sections"
      className="hidden xl:block fixed left-6 top-1/2 -translate-y-1/2 z-10 max-w-[160px]"
    >
      {sections.map(({ id, num, title }) => (
        <a
          key={id}
          href={"#" + id}
          onClick={(e) => goTo(e, id)}
          className={
            "block py-1.5 border-l-2 pl-3 transition-colors " +
            (active === id
              ? "border-flare"
              : "border-rule hover:border-graphite")
          }
        >
          <span
            className={
              "block font-mono text-[10px] tracking-[.14em] " +
              (active === id ? "text-flare font-semibold" : "text-graphite")
            }
          >
            {num}
          </span>
          <span
            className={
              "block font-mono text-[10.5px] leading-snug transition-colors " +
              (active === id ? "text-ink" : "text-graphite hover:text-ink")
            }
          >
            {title}
          </span>
        </a>
      ))}
    </nav>
  );
}