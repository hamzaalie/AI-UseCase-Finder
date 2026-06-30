"use client";

import { useEffect, useState } from "react";
import { SOLUTIONS } from "@/data/solutions";
import { STEPS } from "@/data/steps";
import { ChecklistState, loadChecklist, saveChecklist } from "@/lib/storage";

interface Props {
  solutionIds: string[];
}

export default function Checklist({ solutionIds }: Props) {
  const [checked, setChecked] = useState<ChecklistState>({});

  useEffect(() => {
    setChecked(loadChecklist());
  }, []);

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveChecklist(next);
      return next;
    });
  };

  const groups = solutionIds
    .map((id) => ({ solution: SOLUTIONS[id], steps: STEPS[id] ?? [] }))
    .filter((g) => g.solution && g.steps.length > 0);

  if (groups.length === 0) return null;

  const allKeys = groups.flatMap((g) => g.steps.map((_, i) => `${g.solution.id}:${i}`));
  const doneCount = allKeys.filter((k) => checked[k]).length;

  return (
    <section className="border-t border-ink/10 py-8">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-serif text-2xl">Your first steps</h2>
        <span className="text-sm text-muted">
          {doneCount}/{allKeys.length} done
        </span>
      </div>
      <p className="mt-2 text-sm text-muted">
        Real, doable steps for your top picks. Tick them off — your progress saves automatically.
      </p>

      <div className="mt-5 space-y-6">
        {groups.map(({ solution, steps }) => (
          <div key={solution.id}>
            <h3 className="font-semibold">{solution.name}</h3>
            <ul className="mt-2 space-y-2">
              {steps.map((step, i) => {
                const key = `${solution.id}:${i}`;
                const isDone = !!checked[key];
                return (
                  <li key={key}>
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggle(key)}
                        className="mt-1 h-4 w-4 flex-shrink-0 accent-easy"
                      />
                      <span className={isDone ? "text-muted line-through" : "text-ink"}>{step}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
