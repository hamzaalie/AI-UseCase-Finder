interface Props {
  current: 1 | 2 | 3;
}

const STEPS = [
  { n: 1, label: "Industry" },
  { n: 2, label: "Your tasks" },
  { n: 3, label: "Your plan" },
] as const;

export default function Stepper({ current }: Props) {
  return (
    <nav aria-label="Progress" className="sticky top-0 z-20 -mx-5 bg-paper/85 px-5 py-3 backdrop-blur sm:-mx-6 sm:px-6">
      <ol className="flex items-center gap-2 text-sm">
        {STEPS.map((step, i) => {
          const state = step.n < current ? "done" : step.n === current ? "active" : "todo";
          return (
            <li key={step.n} className="flex items-center gap-2">
              <span
                aria-current={state === "active" ? "step" : undefined}
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  state === "active"
                    ? "bg-accent text-white"
                    : state === "done"
                      ? "bg-easy text-white"
                      : "border border-ink/20 text-muted"
                }`}
              >
                {state === "done" ? "✓" : step.n}
              </span>
              <span className={state === "todo" ? "text-muted" : "font-medium text-ink"}>{step.label}</span>
              {i < STEPS.length - 1 && <span className="mx-1 h-px w-5 bg-ink/15" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
