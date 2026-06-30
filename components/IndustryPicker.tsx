"use client";

import { INDUSTRIES } from "@/data/industries";

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function IndustryPicker({ selected, onSelect }: Props) {
  const current = INDUSTRIES.find((i) => i.id === selected);

  return (
    <section className="border-t border-ink/10 py-8" aria-labelledby="step-industry">
      <h2 id="step-industry" className="font-serif text-2xl">
        <span className="mr-2 text-muted">1.</span>What kind of business do you run?
      </h2>
      <div className="mt-5 flex flex-wrap gap-2.5">
        {INDUSTRIES.map((industry) => {
          const active = selected === industry.id;
          return (
            <button
              key={industry.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(industry.id)}
              className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "border-accent bg-accent text-white"
                  : "border-ink/15 bg-white/60 text-ink hover:border-accent/60"
              }`}
            >
              {industry.label}
            </button>
          );
        })}
      </div>
      {current && (
        <p className="reveal mt-4 text-sm italic text-muted" aria-live="polite">
          {current.blurb}
        </p>
      )}
    </section>
  );
}
