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

const TAKE_LIMIT = 3;
const TAKES_KEY = "aiuf:takes:v1";

function readTakes(): number {
  if (typeof window === "undefined") return 0;
  try {
    return Number(window.localStorage.getItem(TAKES_KEY)) || 0;
  } catch {
    return 0;
  }
}
function writeTakes(n: number) {
  try {
    window.localStorage.setItem(TAKES_KEY, String(n));
  } catch {
    /* ignore */
  }
}

export default function FinderPage() {
  const [industry, setIndustry] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Ratings>({});
  const [step, setStep] = useState<Step>(1);
  const [generated, setGenerated] = useState(false); // has a plan been produced in THIS run
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [takes, setTakes] = useState(0);
  const [blocked, setBlocked] = useState(false);

  // Hydrate selection from the URL (shareable / bookmarkable state) + take count.
  useEffect(() => {
    const state = decodeState(window.location.search);
    const used = readTakes();
    setTakes(used);

    if (state.industry) {
      // A shared / bookmarked plan link always opens, even past the limit.
      setIndustry(state.industry);
      setRatings(state.ratings);
      if (Object.keys(state.ratings).length > 0) {
        setGenerated(true);
        setStep(3);
      } else {
        setStep(2);
      }
    } else if (used >= TAKE_LIMIT) {
      // Fresh visit but they've already used their plans.
      setBlocked(true);
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
  }, [step, hydrated, blocked]);

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
    // Count a "take" the first time a run reaches results.
    if (!generated) {
      const used = readTakes() + 1;
      writeTakes(used);
      setTakes(used);
    }
    setGenerated(true);
    setStep(3);
  }

  function navigate(target: Step) {
    if (target === 1) setStep(1);
    if (target === 2 && industry) setStep(2);
    if (target === 3 && generated) setStep(3);
  }

  function handleReset() {
    // Out of takes → don't start a fresh one; show the limit CTA instead.
    if (readTakes() >= TAKE_LIMIT) {
      setBlocked(true);
      return;
    }
    setIndustry(null);
    setRatings({});
    setGenerated(false);
    setAiMessage(null);
    setStep(1);
    window.history.replaceState(null, "", window.location.pathname);
  }

  const backBtn =
    "inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-accent";

  const brand = (
    <div className="flex items-center justify-between pt-5">
      <Link href="/" className="text-sm font-semibold text-ink hover:text-accent">
        ← AI Use-Case Finder
      </Link>
      {!blocked && takes > 0 && (
        <span className="text-xs text-muted">
          {Math.min(takes, TAKE_LIMIT)}/{TAKE_LIMIT} plans used
        </span>
      )}
    </div>
  );

  if (blocked) {
    return (
      <main className="mx-auto max-w-content px-5 pb-24 sm:px-6 sm:pb-10">
        {brand}
        <LimitScreen />
        <Footer />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-content px-5 pb-24 sm:px-6 sm:pb-10">
      {brand}
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
          {takes < TAKE_LIMIT && (
            <button
              type="button"
              onClick={handleReset}
              className="mb-2 mt-2 text-sm text-muted underline decoration-ink/30 underline-offset-2 hover:text-accent print:hidden"
            >
              ↺ Start over
            </button>
          )}
        </div>
      )}

      <Footer />
    </main>
  );
}

function LimitScreen() {
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@netsolai.cz";
  return (
    <section className="reveal py-12">
      <div className="rounded-2xl bg-ink p-8 text-center text-paper">
        <p className="text-4xl" aria-hidden="true">
          ✅
        </p>
        <h1 className="mt-3 font-serif text-3xl">You&apos;ve explored your 3 plans</h1>
        <p className="mx-auto mt-3 max-w-xl text-paper/80">
          You&apos;ve got a clear picture of where AI fits now. The next step isn&apos;t another plan — it&apos;s
          actually building one. That&apos;s what I do at Netsol AI: I&apos;ll set up your quick wins and build
          the bigger projects so they run for real.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {bookingUrl && (
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-xl bg-accent px-6 py-3 font-semibold text-white"
            >
              Book a free 15-min call
            </a>
          )}
          <a
            href={`mailto:${contactEmail}?subject=${encodeURIComponent("Help building my AI plan")}`}
            className="inline-block rounded-xl border border-paper/40 px-6 py-3 font-semibold text-paper transition-colors hover:bg-paper/10"
          >
            Email Netsol AI
          </a>
        </div>
        <p className="mt-4 text-xs text-paper/60">
          Run a different business?{" "}
          <a href="https://netsolai.cz" target="_blank" rel="noopener noreferrer" className="underline">
            Get in touch
          </a>{" "}
          and I&apos;ll help directly.
        </p>
      </div>
    </section>
  );
}
