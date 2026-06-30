import { MatchResult, ScoredSolution } from "@/lib/match";
import type { SelectionState } from "@/lib/share";
import UseCaseCard from "./UseCaseCard";
import ShareBar from "./ShareBar";
import OpportunityScore from "./OpportunityScore";

interface Props {
  result: MatchResult;
  selection: SelectionState;
}

function Section({
  dot,
  title,
  subtitle,
  items,
  flagFirst,
}: {
  dot: string;
  title: string;
  subtitle: string;
  items: ScoredSolution[];
  flagFirst?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mt-10 first:mt-8">
      <h3 className="flex flex-wrap items-baseline gap-x-2 font-serif text-2xl">
        <span className={`h-2.5 w-2.5 self-center rounded-full ${dot}`} aria-hidden="true" />
        {title}
        <span className="text-base font-normal text-muted">— {subtitle}</span>
      </h3>
      <div className="mt-4 space-y-4">
        {items.map((s, i) => (
          <UseCaseCard key={s.id} solution={s} startHere={flagFirst && i === 0} index={i} />
        ))}
      </div>
    </div>
  );
}

export default function Results({ result, selection }: Props) {
  const { noAiFirst, quickWins, projects, summary } = result;
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;

  return (
    <section className="reveal border-t border-ink/10 py-8" aria-labelledby="step-results">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="step-results" className="font-serif text-2xl">
            <span className="mr-2 text-muted">3.</span>Your AI plan
          </h2>
          <p className="mt-2 max-w-xl text-ink/90" aria-live="polite">
            {summary}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <OpportunityScore result={result} />
      </div>

      <div className="mt-5">
        <ShareBar result={result} selection={selection} />
      </div>

      <Section
        dot="bg-muted"
        title="Before you build anything"
        subtitle="you might not even need AI"
        items={noAiFirst}
      />
      <Section
        dot="bg-easy"
        title="Quick wins"
        subtitle="do these yourself"
        items={quickWins}
        flagFirst
      />
      <Section
        dot="bg-structure"
        title="Bigger projects"
        subtitle="worth getting built right"
        items={projects}
      />

      <div className="mt-10 rounded-2xl bg-ink p-6 text-paper print:hidden">
        <p className="text-lg">
          Some of these are worth doing yourself. Some are worth having built right. If you want help
          deciding — that&apos;s what I do.
        </p>
        {bookingUrl && (
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-xl bg-accent px-5 py-3 font-semibold text-white"
          >
            Book a quick call
          </a>
        )}
      </div>
    </section>
  );
}
