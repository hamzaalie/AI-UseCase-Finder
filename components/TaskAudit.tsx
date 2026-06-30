"use client";

import { tasksForIndustry } from "@/data/industries";
import { TASKS } from "@/data/tasks";
import { Ratings, Severity } from "@/lib/match";

interface Props {
  industryId: string;
  ratings: Ratings;
  onRate: (id: string, severity: Severity) => void;
  onClear: (id: string) => void;
  onSubmit: () => void;
  resultsShown: boolean;
}

const LEVELS: { value: Severity; label: string }[] = [
  { value: 1, label: "A bit" },
  { value: 2, label: "A lot" },
  { value: 3, label: "Major drain" },
];

const ACTIVE_STYLE: Record<Severity, string> = {
  1: "bg-easy text-white border-easy",
  2: "bg-structure text-white border-structure",
  3: "bg-accent text-white border-accent",
};

export default function TaskAudit({ industryId, ratings, onRate, onClear, onSubmit, resultsShown }: Props) {
  const taskIds = tasksForIndustry(industryId);
  const tasks = taskIds.map((id) => TASKS.find((t) => t.id === id)).filter(Boolean) as typeof TASKS;
  const count = Object.values(ratings).filter((v) => v >= 1).length;

  return (
    <section className="reveal border-t border-ink/10 py-8" aria-labelledby="step-tasks">
      <h2 id="step-tasks" className="font-serif text-2xl">
        <span className="mr-2 text-muted">2.</span>How much does each of these hurt?
      </h2>
      <p className="mt-2 text-sm text-muted">
        Rate the ones that apply — leave the rest blank. The harder something hurts, the higher it'll rank in your plan.
      </p>

      <ul className="mt-5 space-y-3">
        {tasks.map((task) => {
          const current = ratings[task.id] ?? 0;
          return (
            <li
              key={task.id}
              className={`rounded-xl border px-4 py-3.5 transition-colors ${
                current >= 1 ? "border-ink/25 bg-white/80" : "border-ink/12 bg-white/50"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <span className="block font-medium">{task.label}</span>
                  <span className="block text-sm text-muted">{task.note}</span>
                </div>
                <div
                  className="flex flex-shrink-0 items-center gap-1.5"
                  role="radiogroup"
                  aria-label={`How much does "${task.label}" hurt?`}
                >
                  {LEVELS.map((lvl) => {
                    const active = current === lvl.value;
                    return (
                      <button
                        key={lvl.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => (active ? onClear(task.id) : onRate(task.id, lvl.value))}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                          active ? ACTIVE_STYLE[lvl.value] : "border-ink/20 bg-white text-muted hover:border-ink/40"
                        }`}
                      >
                        {lvl.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        disabled={count === 0}
        onClick={onSubmit}
        className="mt-6 hidden w-full rounded-xl bg-accent px-6 py-4 text-base font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40 sm:inline-block sm:w-auto"
      >
        {resultsShown ? "Update my plan" : "Build my AI plan"}
        {count > 0 ? ` (${count})` : ""} →
      </button>

      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-paper/95 p-3 backdrop-blur sm:hidden">
          <button type="button" onClick={onSubmit} className="w-full rounded-xl bg-accent px-6 py-4 text-base font-semibold text-white">
            {resultsShown ? "Update my plan" : "Build my AI plan"} ({count}) →
          </button>
        </div>
      )}
    </section>
  );
}
