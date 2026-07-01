"use client";

import { INDUSTRIES } from "@/data/industries";

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function IndustryPicker({ selected, onSelect }: Props) {
  return (
    <section className="border-t border-ink/10 py-8" aria-labelledby="step-industry">
      <p className="text-xs font-bold uppercase tracking-wider text-easy">Step 1 of 3</p>
      <h2 id="step-industry" className="mt-2 font-serif text-3xl">
        What industry are you in?
      </h2>
      <p className="mt-2 text-muted">
        We&apos;ll tailor the recommendations to your sector&apos;s specific challenges and tools.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {INDUSTRIES.map((industry) => {
          const active = selected === industry.id;
          return (
            <button
              key={industry.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(industry.id)}
              className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                active
                  ? "border-easy bg-easy/5 ring-1 ring-easy"
                  : "border-ink/12 bg-white/70 hover:border-easy/50 hover:bg-white"
              }`}
            >
              <span className="text-2xl leading-none" aria-hidden="true">
                {industry.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{industry.label}</span>
                  {active && (
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-easy text-xs text-white">
                      ✓
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block text-sm text-muted">{industry.examples}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
