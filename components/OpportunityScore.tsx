import { MatchResult, OpportunityBand } from "@/lib/match";

const BAND_STYLE: Record<OpportunityBand, { ring: string; text: string }> = {
  Low: { ring: "stroke-muted", text: "text-muted" },
  Moderate: { ring: "stroke-structure", text: "text-structure" },
  High: { ring: "stroke-easy", text: "text-easy" },
  "Very high": { ring: "stroke-accent", text: "text-accent" },
};

interface Props {
  result: MatchResult;
}

export default function OpportunityScore({ result }: Props) {
  const { opportunityScore, opportunityBand, profile, ratedCount } = result;
  const style = BAND_STYLE[opportunityBand];

  // SVG ring geometry
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const dash = (opportunityScore / 100) * circumference;

  return (
    <div className="rounded-2xl border border-ink/10 bg-white/70 p-5 sm:p-6">
      <div className="flex items-center gap-5">
        <div className="relative flex-shrink-0" aria-hidden="true">
          <svg width="104" height="104" viewBox="0 0 104 104" className="-rotate-90">
            <circle cx="52" cy="52" r={r} fill="none" stroke="currentColor" className="text-ink/10" strokeWidth="9" />
            <circle
              cx="52"
              cy="52"
              r={r}
              fill="none"
              className={style.ring}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-serif text-2xl leading-none ${style.text}`}>{opportunityScore}</span>
            <span className="text-[10px] uppercase tracking-wide text-muted">/ 100</span>
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">AI Opportunity Score</p>
          <p className={`font-serif text-xl ${style.text}`}>
            {opportunityBand}
            <span className="ml-2 align-middle text-sm font-normal text-muted">· {profile.archetype}</span>
          </p>
          <p className="mt-1 text-sm text-ink/90">{profile.line}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">
        Based purely on the {ratedCount} pain{ratedCount === 1 ? "" : "s"} you rated — not a guess or an invented figure.
      </p>
    </div>
  );
}
