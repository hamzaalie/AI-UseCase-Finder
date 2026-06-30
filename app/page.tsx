"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Hero from "@/components/Hero";
import Stepper from "@/components/Stepper";
import IndustryPicker from "@/components/IndustryPicker";
import TaskAudit from "@/components/TaskAudit";
import Results from "@/components/Results";
import Checklist from "@/components/Checklist";
import EmailCapture from "@/components/EmailCapture";
import Footer from "@/components/Footer";
import { getMatches, Ratings, Severity } from "@/lib/match";
import { decodeState, encodeState, shareUrl } from "@/lib/share";

export default function Page() {
  const [industry, setIndustry] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Ratings>({});
  const [showResults, setShowResults] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Hydrate selection from the URL (shareable / bookmarkable state).
  useEffect(() => {
    const state = decodeState(window.location.search);
    if (state.industry) {
      setIndustry(state.industry);
      setRatings(state.ratings);
      if (Object.keys(state.ratings).length > 0) setShowResults(true);
    }
    setHydrated(true);
  }, []);

  // Keep the URL in sync once the user has results.
  useEffect(() => {
    if (!hydrated || !showResults) return;
    const qs = encodeState({ industry, ratings });
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [industry, ratings, showResults, hydrated]);

  const result = useMemo(() => (industry ? getMatches(industry, ratings) : null), [industry, ratings]);
  const orderedIds = useMemo(() => result?.ordered.map((s) => s.id) ?? [], [result]);
  const ratedTaskIds = useMemo(() => Object.keys(ratings).filter((id) => ratings[id] >= 1), [ratings]);

  function handleSelectIndustry(id: string) {
    if (id === industry) return;
    setIndustry(id);
    setRatings({});
    setShowResults(false);
  }

  function handleRate(id: string, severity: Severity) {
    setRatings((prev) => ({ ...prev, [id]: severity }));
  }

  function handleClear(id: string) {
    setRatings((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function handleSubmit() {
    if (ratedTaskIds.length === 0) return;
    const firstView = !showResults;
    setShowResults(true);
    requestAnimationFrame(() => {
      if (firstView) resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleReset() {
    setIndustry(null);
    setRatings({});
    setShowResults(false);
    window.history.replaceState(null, "", window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const step: 1 | 2 | 3 = showResults ? 3 : industry ? 2 : 1;

  return (
    <main className="mx-auto max-w-content px-5 pb-24 sm:px-6 sm:pb-8">
      <Stepper current={step} />
      <Hero />

      <IndustryPicker selected={industry} onSelect={handleSelectIndustry} />

      {industry && (
        <TaskAudit
          industryId={industry}
          ratings={ratings}
          onRate={handleRate}
          onClear={handleClear}
          onSubmit={handleSubmit}
          resultsShown={showResults}
        />
      )}

      {showResults && result && (
        <div ref={resultsRef} className="scroll-mt-16">
          <Results result={result} selection={{ industry, ratings }} />
          <Checklist solutionIds={orderedIds} />
          <div className="border-t border-ink/10 py-8 print:hidden">
            <EmailCapture industry={industry} tasks={ratedTaskIds} planUrl={shareUrl({ industry, ratings })} />
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="mb-2 text-sm text-muted underline decoration-ink/30 underline-offset-2 hover:text-accent print:hidden"
          >
            ↺ Start over
          </button>
        </div>
      )}

      <Footer />
    </main>
  );
}
