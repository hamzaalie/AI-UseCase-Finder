import { DEFAULT_WEIGHT, INDUSTRIES } from "@/data/industries";
import { Category, SOLUTIONS, Solution } from "@/data/solutions";

/** 1 = a bit, 2 = a lot, 3 = a major drain. Anything absent = not an issue. */
export type Severity = 1 | 2 | 3;
export type Ratings = Record<string, number>;

export const SEVERITY_LABELS: Record<Severity, string> = {
  1: "A bit",
  2: "A lot",
  3: "Major drain",
};

export interface ScoredSolution extends Solution {
  score: number; // higher = more relevant for this user, in this industry
  severity: Severity; // what the user rated this pain
  synergyWith: string[]; // names of other chosen solutions this one amplifies
  reason: string; // plain-English "why this ranks here for you"
}

export type OpportunityBand = "Low" | "Moderate" | "High" | "Very high";

export interface Profile {
  archetype: string; // short label, e.g. "Lead-conversion focused"
  line: string; // one honest sentence on where the biggest lever is
  topCategory: Category | null;
}

export interface MatchResult {
  noAiFirst: ScoredSolution[]; // honesty layer: "not really AI"
  quickWins: ScoredSolution[]; // easy, do-it-yourself
  projects: ScoredSolution[]; // bigger builds
  ordered: ScoredSolution[]; // display order
  summary: string;
  industryLabel: string;
  opportunityScore: number; // 0–100, derived ONLY from the user's own ratings
  opportunityBand: OpportunityBand;
  profile: Profile;
  ratedCount: number;
}

const SYNERGY_BONUS = 1.5;
const MAX_PER_TASK = 30; // max weight (10) × max severity (3)

function weightFor(industryId: string, taskId: string): number {
  const industry = INDUSTRIES.find((i) => i.id === industryId);
  return industry?.weights[taskId] ?? DEFAULT_WEIGHT;
}

function byRelevance(a: ScoredSolution, b: ScoredSolution): number {
  if (b.score !== a.score) return b.score - a.score;
  if (b.severity !== a.severity) return b.severity - a.severity;
  if (b.impact !== a.impact) return b.impact - a.impact;
  return a.id.localeCompare(b.id);
}

function reasonFor(weight: number, severity: Severity, synergyCount: number, industryLabel: string): string {
  const intensity =
    severity === 3 ? "you flagged this as a major drain" : severity === 2 ? "this is hurting you a lot" : "you flagged this as a minor pain";
  const relevance = weight >= 8 ? "and it's one of the highest-impact areas" : weight >= 6 ? "and it matters a lot" : "in a moderate-impact area";
  const synergy = synergyCount > 0 ? ` It also compounds with ${synergyCount} other thing${synergyCount > 1 ? "s" : ""} you picked.` : "";
  return `Ranked here because ${intensity} ${relevance} for ${industryLabel.toLowerCase()}.${synergy}`;
}

export function getMatches(industryId: string, ratings: Ratings): MatchResult {
  const industry = INDUSTRIES.find((i) => i.id === industryId);
  const industryLabel = industry?.label ?? "your business";

  // Only tasks rated 1+ count. Normalise to valid severities.
  const rated = Object.entries(ratings)
    .map(([id, v]) => [id, Math.max(0, Math.min(3, Math.round(v)))] as const)
    .filter(([id, v]) => v >= 1 && SOLUTIONS[id]);

  const ratedIds = new Set(rated.map(([id]) => id));

  const scored: ScoredSolution[] = rated.map(([id, sev]) => {
    const solution = SOLUTIONS[id];
    const severity = sev as Severity;
    const weight = weightFor(industryId, id);

    const partners = (solution.synergies ?? []).filter((p) => ratedIds.has(p));
    const synergyWith = partners.map((p) => SOLUTIONS[p]?.name).filter(Boolean) as string[];

    const score = weight * severity + partners.length * SYNERGY_BONUS;

    return {
      ...solution,
      severity,
      score,
      synergyWith,
      reason: reasonFor(weight, severity, partners.length, industryLabel),
    };
  });

  const noAiFirst = scored.filter((s) => s.notReallyAI).sort(byRelevance);
  const quickWins = scored.filter((s) => s.effort === "quickwin" && !s.notReallyAI).sort(byRelevance);
  const projects = scored.filter((s) => s.effort === "project").sort(byRelevance);
  const ordered = [...noAiFirst, ...quickWins, ...projects];

  const { opportunityScore, opportunityBand } = computeOpportunity(industryId, rated);
  const profile = computeProfile(scored);

  return {
    noAiFirst,
    quickWins,
    projects,
    ordered,
    summary: buildSummary(industryLabel, { noAiFirst, quickWins, projects }),
    industryLabel,
    opportunityScore,
    opportunityBand,
    profile,
    ratedCount: rated.length,
  };
}

/** Score is an honest summary of the pain the user reported — never a fabricated figure. */
function computeOpportunity(
  industryId: string,
  rated: ReadonlyArray<readonly [string, number]>
): { opportunityScore: number; opportunityBand: OpportunityBand } {
  if (rated.length === 0) return { opportunityScore: 0, opportunityBand: "Low" };

  const perTask = rated.map(([id, sev]) => (weightFor(industryId, id) * sev) / MAX_PER_TASK); // each 0–1
  const intensity = perTask.reduce((a, b) => a + b, 0) / perTask.length; // 0–1
  const breadth = Math.min(rated.length / 5, 1); // 0–1, 5+ pains = full breadth

  let score = Math.round((intensity * 0.7 + breadth * 0.3) * 100);
  score = Math.max(5, Math.min(99, score)); // avoid absolute 0/100

  const band: OpportunityBand =
    score >= 80 ? "Very high" : score >= 60 ? "High" : score >= 35 ? "Moderate" : "Low";

  return { opportunityScore: score, opportunityBand: band };
}

const ARCHETYPES: Record<Category, { archetype: string; line: string }> = {
  "Sales & leads": {
    archetype: "Lead-conversion focused",
    line: "Your biggest lever is capturing and converting the leads you already get — speed and follow-up will move the needle most.",
  },
  Marketing: {
    archetype: "Visibility-building",
    line: "Your biggest lever is showing up consistently — getting marketing to happen without it eating your week.",
  },
  Operations: {
    archetype: "Operations-heavy",
    line: "Your time is going to repetitive operational work that's ripe to automate — free that up first.",
  },
  "Admin & finance": {
    archetype: "Admin-bound",
    line: "Back-office admin is the real drag; automating it is the fastest way to win hours back.",
  },
  "Customer service": {
    archetype: "Support-stretched",
    line: "Handling customer questions is your bottleneck — deflection and triage will relieve the most pressure.",
  },
};

function computeProfile(scored: ScoredSolution[]): Profile {
  if (scored.length === 0) return { archetype: "Not enough signal yet", line: "Rate a few pains and I'll read your profile.", topCategory: null };

  const totals: Record<string, number> = {};
  for (const s of scored) {
    totals[s.category] = (totals[s.category] ?? 0) + s.score;
  }
  const top = (Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null) as Category | null;
  const meta = top ? ARCHETYPES[top] : null;
  return {
    archetype: meta?.archetype ?? "Mixed priorities",
    line: meta?.line ?? "Your pains are spread evenly — start with the highest-rated quick win.",
    topCategory: top,
  };
}

function buildSummary(
  industryLabel: string,
  groups: { noAiFirst: ScoredSolution[]; quickWins: ScoredSolution[]; projects: ScoredSolution[] }
): string {
  const total = groups.noAiFirst.length + groups.quickWins.length + groups.projects.length;
  if (total === 0) return "Rate a task or two above and I'll show you exactly what fits.";

  const top = groups.quickWins[0] ?? groups.noAiFirst[0] ?? groups.projects[0];
  const parts: string[] = [];
  if (groups.noAiFirst.length > 0)
    parts.push(`${groups.noAiFirst.length} thing${groups.noAiFirst.length > 1 ? "s" : ""} you can fix today without AI at all`);
  if (groups.quickWins.length > 0) parts.push(`${groups.quickWins.length} quick win${groups.quickWins.length > 1 ? "s" : ""}`);
  if (groups.projects.length > 0) parts.push(`${groups.projects.length} bigger project${groups.projects.length > 1 ? "s" : ""} worth building`);

  const list = parts.length > 1 ? parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1] : parts[0];
  return `Based on what you rated, here's your plan for ${industryLabel.toLowerCase()}: ${list}. Start with the “${top.name}”.`;
}
