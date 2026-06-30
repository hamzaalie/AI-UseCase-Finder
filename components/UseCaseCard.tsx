import { Difficulty, ToolTier } from "@/data/solutions";
import { ScoredSolution, Severity } from "@/lib/match";
import HonestyNote from "./HonestyNote";

const DIFFICULTY: Record<Difficulty, { label: string; className: string }> = {
  diy: { label: "Set up yourself · today", className: "bg-easy/10 text-easy" },
  weekend: { label: "A weekend project", className: "bg-structure/10 text-structure" },
  build: { label: "Worth getting built right", className: "bg-accent/10 text-accent" },
};

const TIER: Record<ToolTier, { label: string; className: string }> = {
  free: { label: "free", className: "text-easy" },
  freemium: { label: "free tier", className: "text-structure" },
  paid: { label: "paid", className: "text-muted" },
};

const SEVERITY: Record<Severity, { label: string; className: string }> = {
  1: { label: "Minor pain", className: "border-easy/40 text-easy" },
  2: { label: "Hurts a lot", className: "border-structure/40 text-structure" },
  3: { label: "Major drain", className: "border-accent/50 text-accent" },
};

interface Props {
  solution: ScoredSolution;
  startHere?: boolean;
  index?: number;
}

export default function UseCaseCard({ solution, startHere, index = 0 }: Props) {
  const diff = DIFFICULTY[solution.difficulty];
  const sev = SEVERITY[solution.severity];
  const pb = solution.playbook;

  return (
    <article
      className="reveal rounded-2xl border border-ink/10 bg-white/70 p-5 shadow-sm sm:p-6"
      style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}
    >
      <div className="flex flex-wrap items-center gap-2">
        {startHere && (
          <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Start here
          </span>
        )}
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${sev.className}`}>{sev.label}</span>
        {solution.notReallyAI && (
          <span className="rounded-full border border-ink/20 px-2.5 py-1 text-xs font-semibold text-muted">Not really AI</span>
        )}
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${diff.className}`}>{diff.label}</span>
        <span className="ml-auto text-xs font-medium uppercase tracking-wide text-muted">{solution.category}</span>
      </div>

      <h3 className="mt-3 font-serif text-xl">{solution.name}</h3>
      <p className="mt-2 text-ink/90">{solution.what}</p>
      <p className="mt-2 text-sm text-muted">{solution.why}</p>

      {/* Why this ranks here for YOU */}
      <p className="mt-3 rounded-lg bg-accent/5 px-3 py-2 text-sm text-ink/80">
        <span className="font-semibold text-accent">For you: </span>
        {solution.reason}
      </p>

      <dl className="mt-4 grid grid-cols-1 gap-3 rounded-xl bg-paper/70 p-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Setup</dt>
          <dd className="mt-0.5">{solution.setupTime}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Typical cost</dt>
          <dd className="mt-0.5">{solution.cost}</dd>
        </div>
      </dl>

      {solution.tools.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Tools to start with</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {solution.tools.map((tool) => (
              <li key={tool.name}>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={tool.note}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-ink/15 bg-white px-2.5 py-1.5 text-sm transition-colors hover:border-accent/60"
                >
                  <span className="font-medium">{tool.name}</span>
                  <span className={`text-xs ${TIER[tool.tier].className}`}>{TIER[tool.tier].label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {solution.synergyWith.length > 0 && (
        <p className="mt-4 text-sm text-structure">
          ↔ Pairs with your pick{solution.synergyWith.length > 1 ? "s" : ""}:{" "}
          <span className="font-medium">{solution.synergyWith.join(", ")}</span>
        </p>
      )}

      {solution.honestNote && <HonestyNote note={solution.honestNote} />}

      {/* The deep playbook — native <details> so it's accessible + prints expanded-on-demand */}
      <details className="group mt-4 rounded-xl border border-ink/10 bg-paper/40 open:bg-paper/70">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold">
          <span>See the full playbook — how it works, the stack, the rollout</span>
          <span className="ml-2 text-muted transition-transform group-open:rotate-180" aria-hidden="true">
            ▾
          </span>
        </summary>

        <div className="space-y-5 px-4 pb-4 text-sm">
          <div>
            <h4 className="font-semibold text-ink">How it actually works</h4>
            <p className="mt-1 text-ink/80">{pb.howItWorks}</p>
          </div>

          <div>
            <h4 className="font-semibold text-ink">The stack</h4>
            <ul className="mt-2 space-y-1.5">
              {pb.stack.map((s) => (
                <li key={s.layer} className="flex flex-wrap gap-x-2">
                  <span className="font-medium text-structure">{s.layer}:</span>
                  <span className="font-medium">{s.tool}</span>
                  <span className="text-muted">— {s.does}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-ink">How to roll it out</h4>
            <ol className="mt-2 space-y-2">
              {pb.phases.map((p, i) => (
                <li key={p.title} className="flex gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-ink/10 text-xs font-bold">
                    {i + 1}
                  </span>
                  <span>
                    <span className="font-medium">{p.title}</span>
                    <span className="block text-muted">{p.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h4 className="font-semibold text-ink">Watch out for</h4>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-ink/80">
              {pb.watchOuts.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-easy/30 bg-easy/5 p-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-easy">Worth it when</h4>
              <p className="mt-1 text-ink/80">{pb.worthItWhen}</p>
            </div>
            <div className="rounded-lg border border-ink/15 bg-white/60 p-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">Skip it if</h4>
              <p className="mt-1 text-ink/80">{pb.skipIf}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1 border-t border-ink/10 pt-3 text-ink/80 sm:flex-row sm:justify-between">
            <p>
              <span className="font-semibold text-ink">Track this:</span> {pb.metric}
            </p>
            <p>
              <span className="font-semibold text-ink">Time to value:</span> {pb.timeToValue}
            </p>
          </div>
        </div>
      </details>
    </article>
  );
}
