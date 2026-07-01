import { Tier } from "@/data/solutions";
import { ScoredSolution, Severity } from "@/lib/match";

const SEVERITY: Record<Severity, { label: string; className: string }> = {
  1: { label: "Minor pain", className: "border-easy/40 text-easy" },
  2: { label: "Hurts a lot", className: "border-structure/40 text-structure" },
  3: { label: "Major drain", className: "border-accent/50 text-accent" },
};

const TIER_STYLE: Record<Tier["level"], { icon: string; ring: string; chip: string }> = {
  "Quick Win": { icon: "⚡", ring: "border-easy/30 bg-easy/5", chip: "bg-easy/15 text-easy" },
  "Workflow Fix": { icon: "🔧", ring: "border-structure/30 bg-structure/5", chip: "bg-structure/15 text-structure" },
  "Built right": { icon: "💎", ring: "border-accent/30 bg-accent/5", chip: "bg-accent/15 text-accent" },
};

interface Props {
  solution: ScoredSolution;
  rank: number;
  defaultOpen?: boolean;
}

export default function UseCaseCard({ solution, rank, defaultOpen }: Props) {
  const sev = SEVERITY[solution.severity];
  const quickTime = solution.tiers[0]?.time ?? solution.setupTime;

  return (
    <article className="reveal overflow-hidden rounded-2xl border border-ink/10 bg-white/80 shadow-sm">
      <details open={defaultOpen} className="group">
        <summary className="flex cursor-pointer list-none items-start gap-3 p-5">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-paper">
            {rank}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-serif text-lg leading-tight">{solution.name}</span>
              {solution.notReallyAI && (
                <span className="rounded-full border border-ink/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-muted">
                  Not really AI
                </span>
              )}
            </span>
            <span className="mt-1 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-easy/10 px-2 py-0.5 text-xs font-medium text-easy">
                {solution.category}
              </span>
              <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${sev.className}`}>
                {sev.label}
              </span>
            </span>
          </span>
          <span className="flex flex-shrink-0 items-center gap-2">
            <span className="rounded-full bg-paper px-2.5 py-1 text-xs font-semibold text-muted">
              {quickTime}
            </span>
            <span className="text-muted transition-transform group-open:rotate-180" aria-hidden="true">
              ▾
            </span>
          </span>
        </summary>

        <div className="border-t border-ink/8 px-5 pb-5 pt-4">
          {/* Why this ranks for YOU */}
          <p className="rounded-lg bg-accent/5 px-3 py-2 text-sm text-ink/80">
            <span className="font-semibold text-accent">For you: </span>
            {solution.reason}
          </p>

          {/* THE PROBLEM */}
          <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-muted">The problem</p>
          <p className="mt-1.5 border-l-2 border-ink/20 pl-3 italic text-ink/80">{solution.problem}</p>

          {/* HOW AI HELPS */}
          <div className="mt-4 rounded-xl bg-easy/5 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-easy">How AI helps</p>
            <ul className="mt-2 space-y-1.5">
              {solution.helps.map((h, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="mt-0.5 flex-shrink-0 text-easy" aria-hidden="true">
                    ✓
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* IMPLEMENTATION TIERS */}
          <p className="mt-5 text-[11px] font-bold uppercase tracking-wider text-muted">Implementation tiers</p>
          <div className="mt-2 space-y-2.5">
            {solution.tiers.map((tier) => {
              const st = TIER_STYLE[tier.level];
              return (
                <div key={tier.level} className={`rounded-xl border p-3.5 ${st.ring}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span aria-hidden="true">{st.icon}</span>
                    <span className="font-semibold">{tier.level}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${st.chip}`}>{tier.time}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-ink/80">{tier.what}</p>
                  <p className="mt-1.5 text-sm">
                    <span className="font-semibold">Impact: </span>
                    <span className="text-ink/70">{tier.impact}</span>
                  </p>
                </div>
              );
            })}
          </div>

          {/* Tools */}
          {solution.tools.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Tools to start with</p>
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
                      <span className="text-xs text-muted">{tool.tier === "free" ? "free" : tool.tier === "freemium" ? "free tier" : "paid"}</span>
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

          {/* The honest take */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-easy/30 bg-easy/5 p-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-easy">Worth it when</p>
              <p className="mt-1 text-sm text-ink/80">{solution.playbook.worthItWhen}</p>
            </div>
            <div className="rounded-lg border border-ink/15 bg-paper/60 p-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Skip it if</p>
              <p className="mt-1 text-sm text-ink/80">{solution.playbook.skipIf}</p>
            </div>
          </div>

          <p className="mt-3 text-sm text-ink/80">
            <span className="font-semibold">Track this: </span>
            {solution.playbook.metric}
          </p>

          {solution.honestNote && (
            <p className="mt-3 flex gap-2 rounded-lg border border-ink/10 bg-paper px-3 py-2 text-sm text-muted">
              <span aria-hidden="true">💡</span>
              <span>
                <span className="font-semibold text-ink">Honest take: </span>
                {solution.honestNote}
              </span>
            </p>
          )}
        </div>
      </details>
    </article>
  );
}
