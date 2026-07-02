"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Hero from "@/components/Hero";
import Stepper from "@/components/Stepper";
import IndustryPicker from "@/components/IndustryPicker";
import ProblemDescriber from "@/components/ProblemDescriber";
import TaskAudit from "@/components/TaskAudit";
import Results from "@/components/Results";
import Footer from "@/components/Footer";
import { getMatches, Ratings, Severity } from "@/lib/match";
import { decodeState, encodeState, shareUrl, planPdfUrl } from "@/lib/share";

type Step = 1 | 2 | 3;

export default function FinderPage() {
  const [industry, setIndustry] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Ratings>({});
  const [step, setStep] = useState<Step>(1);
  const [generated, setGenerated] = useState(false); // has a plan been produced at least once
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate selection from the URL (shareable / bookmarkable state).
  useEffect(() => {
    const state = decodeState(window.location.search);
    if (state.industry) {
      setIndustry(state.industry);
      setRatings(state.ratings);
      if (Object.keys(state.ratings).length > 0) {
        setGenerated(true);
        setStep(3);
      } else {
        setStep(2);
      }
    }
    setHydrated(true);
  }, []);

  // Keep the URL in sync once a plan exists.
  useEffect(() => {
    if (!hydrated || step !== 3) return;
    const qs = encodeState({ industry, ratings });
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [industry, ratings, step, hydrated]);

  // Wizard feel: jump to top whenever the step changes.
  useEffect(() => {
    if (hydrated) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, hydrated]);

  const result = useMemo(() => (industry ? getMatches(industry, ratings) : null), [industry, ratings]);
  const ratedTaskIds = useMemo(() => Object.keys(ratings).filter((id) => ratings[id] >= 1), [ratings]);

  function handleSelectIndustry(id: string) {
    if (id !== industry) {
      setIndustry(id);
      setRatings({});
      setAiMessage(null);
    }
    setStep(2); // advance as soon as an industry is chosen
  }

  async function handleInterpret(description: string) {
    const res = await fetch("/api/interpret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ industry, description }),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || "interpret failed");
    setRatings((prev) => ({ ...prev, ...(data.ratings ?? {}) }));
    setAiMessage(typeof data.message === "string" ? data.message : null);
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
    setGenerated(true);
    setStep(3);
  }

  function navigate(target: Step) {
    if (target === 1) setStep(1);
    if (target === 2 && industry) setStep(2);
    if (target === 3 && generated) setStep(3);
  }

  function handleReset() {
    setIndustry(null);
    setRatings({});
    setGenerated(false);
    setAiMessage(null);
    setStep(1);
    window.history.replaceState(null, "", window.location.pathname);
  }

  const backBtn =
    "inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-accent";

  return (
    <main className="mx-auto max-w-content px-5 pb-24 sm:px-6 sm:pb-10">
      <div className="flex items-center justify-between pt-5">
        <Link href="/" className="text-sm font-semibold text-ink hover:text-accent">
          ← AI Use-Case Finder
        </Link>
      </div>

      <Stepper current={step} onNavigate={navigate} canGoTasks={!!industry} canGoResults={generated} />

      {step === 1 && (
        <>
          <Hero />
          <IndustryPicker selected={industry} onSelect={handleSelectIndustry} />
        </>
      )}

      {step === 2 && industry && (
        <div className="pt-6">
          <button type="button" onClick={() => navigate(1)} className={backBtn}>
            ← Back to industry
          </button>
          <div className="pt-6">
            <ProblemDescriber onInterpret={handleInterpret} />
          </div>
          <TaskAudit
            industryId={industry}
            ratings={ratings}
            onRate={handleRate}
            onClear={handleClear}
            onSubmit={handleSubmit}
            resultsShown={generated}
          />
        </div>
      )}

      {step === 3 && result && (
        <div className="pt-6 scroll-mt-16">
          <button type="button" onClick={() => navigate(2)} className={`${backBtn} print:hidden`}>
            ← Edit my answers
          </button>
          <Results
            result={result}
            selection={{ industry, ratings }}
            planUrl={shareUrl({ industry, ratings })}
            planPdfUrl={planPdfUrl({ industry, ratings })}
            aiMessage={aiMessage}
          />
          <button
            type="button"
            onClick={handleReset}
            className="mb-2 mt-2 text-sm text-muted underline decoration-ink/30 underline-offset-2 hover:text-accent print:hidden"
          >
            ↺ Start over
          </button>
        </div>
      )}

      <Footer />
    </main>
  );
}
