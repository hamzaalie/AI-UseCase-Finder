import { INDUSTRIES } from "@/data/industries";
import { TASKS } from "@/data/tasks";
import type { MatchResult, Ratings } from "./match";

export interface SelectionState {
  industry: string | null;
  ratings: Ratings;
}

const VALID_INDUSTRY = new Set(INDUSTRIES.map((i) => i.id));
const VALID_TASK = new Set(TASKS.map((t) => t.id));

/**
 * Decode selection from a query string.
 * Format: ?i=trades&t=quoting:3,leadreply:2,scheduling:1
 * Falls back gracefully: a bare task id (no severity) is treated as severity 2.
 */
export function decodeState(search: string | URLSearchParams): SelectionState {
  const params = typeof search === "string" ? new URLSearchParams(search) : search;
  const rawIndustry = params.get("i");
  const industry = rawIndustry && VALID_INDUSTRY.has(rawIndustry) ? rawIndustry : null;

  const ratings: Ratings = {};
  const rawTasks = params.get("t");
  if (rawTasks) {
    for (const token of rawTasks.split(",")) {
      const [id, sevRaw] = token.split(":").map((s) => s.trim());
      if (!VALID_TASK.has(id)) continue;
      const sev = Math.max(1, Math.min(3, Math.round(Number(sevRaw) || 2)));
      ratings[id] = sev;
    }
  }
  return { industry, ratings };
}

export function encodeState(state: SelectionState): string {
  const params = new URLSearchParams();
  if (state.industry) params.set("i", state.industry);
  const entries = Object.entries(state.ratings).filter(([, v]) => v >= 1);
  if (entries.length) params.set("t", entries.map(([id, v]) => `${id}:${v}`).join(","));
  return params.toString();
}

export function shareUrl(state: SelectionState): string {
  const base = typeof window !== "undefined" ? window.location.origin + window.location.pathname : "";
  const qs = encodeState(state);
  return qs ? `${base}?${qs}` : base;
}

/** Plain-text version of the full plan — for copy-to-clipboard / pasting into notes. */
export function planToText(result: MatchResult): string {
  const lines: string[] = [];
  lines.push(`AI Plan — ${result.industryLabel}`);
  lines.push("=".repeat(44));
  lines.push("");
  lines.push(`AI Opportunity Score: ${result.opportunityScore}/100 (${result.opportunityBand})`);
  lines.push(`Profile: ${result.profile.archetype} — ${result.profile.line}`);
  lines.push("");
  lines.push(result.summary);
  lines.push("");

  const section = (title: string, items: typeof result.ordered) => {
    if (!items.length) return;
    lines.push(title.toUpperCase());
    lines.push("-".repeat(title.length));
    items.forEach((s) => {
      lines.push(`• ${s.name}  [${["", "minor", "hurts a lot", "major drain"][s.severity]}]`);
      lines.push(`    ${s.what}`);
      lines.push(`    Setup: ${s.setupTime}  |  Cost: ${s.cost}  |  Time to value: ${s.playbook.timeToValue}`);
      lines.push(`    How it works: ${s.playbook.howItWorks}`);
      lines.push(`    Stack: ${s.playbook.stack.map((l) => `${l.tool} (${l.layer})`).join(" → ")}`);
      lines.push(`    Rollout:`);
      s.playbook.phases.forEach((p) => lines.push(`      ${p.title} — ${p.detail}`));
      lines.push(`    Worth it when: ${s.playbook.worthItWhen}`);
      lines.push(`    Skip if: ${s.playbook.skipIf}`);
      lines.push(`    Track: ${s.playbook.metric}`);
      if (s.honestNote) lines.push(`    Honest take: ${s.honestNote}`);
      lines.push("");
    });
  };

  section("Before you build anything (no AI needed)", result.noAiFirst);
  section("Quick wins (do it yourself)", result.quickWins);
  section("Bigger projects (worth building)", result.projects);

  lines.push("Built with the AI Use-Case Finder · Netsol AI · netsolai.cz");
  return lines.join("\n");
}
