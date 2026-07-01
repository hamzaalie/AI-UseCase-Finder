"use client";

import { useEffect, useState } from "react";
import { MatchResult } from "@/lib/match";
import type { SelectionState } from "@/lib/share";
import UseCaseCard from "./UseCaseCard";
import ShareBar from "./ShareBar";
import OpportunityScore from "./OpportunityScore";
import EmailCapture from "./EmailCapture";
import Checklist from "./Checklist";

interface Props {
  result: MatchResult;
  selection: SelectionState;
  planUrl: string;
  planPdfUrl: string;
  aiMessage?: string | null;
}

const FREE_COUNT = 3;
const UNLOCK_KEY = "aiuf:unlocked:v1";

export default function Results({ result, selection, planUrl, planPdfUrl, aiMessage }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;

  // Once someone has unlocked (left their email), don't gate them again.
  useEffect(() => {
    try {
      if (window.localStorage.getItem(UNLOCK_KEY) === "1") setUnlocked(true);
    } catch {
      /* ignore */
    }
  }, []);

  function unlock() {
    setUnlocked(true);
    try {
      window.localStorage.setItem(UNLOCK_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  const all = result.ordered;
  const total = all.length;
  const free = all.slice(0, FREE_COUNT);
  const rest = all.slice(FREE_COUNT);
  const showRest = unlocked || rest.length === 0;

  return (
    <section className="reveal border-t border-ink/10 py-8" aria-labelledby="step-results">
      <p className="text-xs font-bold uppercase tracking-wider text-easy">Your results</p>
      <h2 id="step-results" className="mt-2 font-serif text-3xl">
        Your AI implementation roadmap
      </h2>
      <p className="mt-2 max-w-xl text-muted" aria-live="polite">
        {result.summary}
      </p>

      {aiMessage && (
        <div className="mt-5 rounded-2xl border border-structure/30 bg-structure/5 p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-structure">What I heard</p>
          <p className="mt-1.5 text-ink/90">{aiMessage}</p>
        </div>
      )}

      <div className="mt-5">
        <OpportunityScore result={result} />
      </div>

      <div className="mt-4 rounded-xl bg-ink px-5 py-4 text-center text-paper">
        We found <span className="font-bold text-easy">{total} AI opportunities</span> for your business.
      </div>

      {/* Top recommendations (always free) */}
      <p className="mt-8 text-[11px] font-bold uppercase tracking-wider text-muted">
        Your top {Math.min(FREE_COUNT, total)} recommendation{Math.min(FREE_COUNT, total) > 1 ? "s" : ""}
      </p>
      <div className="mt-3 space-y-4">
        {free.map((sol, i) => (
          <UseCaseCard key={sol.id} solution={sol} rank={i + 1} defaultOpen={i === 0} />
        ))}
      </div>

      {/* Gate → the rest */}
      {rest.length > 0 && !unlocked && (
        <div className="mt-6">
          <EmailCapture
            industry={selection.industry}
            tasks={Object.keys(selection.ratings).filter((k) => selection.ratings[k] >= 1)}
            planUrl={planUrl}
            planPdfUrl={planPdfUrl}
            lockedCount={rest.length}
            onSuccess={unlock}
          />
        </div>
      )}

      {showRest && rest.length > 0 && (
        <div className="mt-4 space-y-4">
          {rest.map((sol, i) => (
            <UseCaseCard key={sol.id} solution={sol} rank={FREE_COUNT + i + 1} />
          ))}
        </div>
      )}

      {/* Full-plan tools + checklist appear once unlocked */}
      {showRest && (
        <>
          <div className="mt-8">
            <ShareBar result={result} selection={selection} />
          </div>
          <Checklist solutionIds={all.map((s) => s.id)} />
        </>
      )}

      {/* Booking bridge */}
      <div className="mt-10 rounded-2xl bg-ink p-6 text-center text-paper print:hidden">
        <p className="font-serif text-xl">Ready to implement?</p>
        <p className="mt-2 text-paper/80">
          Some of these are worth doing yourself. Some are worth having built right. If you want help
          deciding — that&apos;s what I do.
        </p>
        {bookingUrl && (
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-xl bg-accent px-6 py-3 font-semibold text-white"
          >
            Book a quick call
          </a>
        )}
      </div>
    </section>
  );
}
