"use client";

import { FormEvent, useState } from "react";

type Variant = "gate" | "newsletter";

interface Props {
  variant?: Variant;
  industry: string | null;
  tasks: string[];
  planUrl: string;
  planPdfUrl: string;
  lockedCount: number; // recommendations still locked (gate variant)
  onSuccess: () => void;
}

type Status = "idle" | "loading" | "error";

export default function EmailCapture({
  variant = "gate",
  industry,
  tasks,
  planUrl,
  planPdfUrl,
  lockedCount,
  onSuccess,
}: Props) {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [done, setDone] = useState(false);
  const isNewsletter = variant === "newsletter";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, industry, tasks, planUrl, planPdfUrl, source: variant, hp }),
      });
      if (res.ok) {
        setDone(true);
        onSuccess();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (done) {
    return (
      <section className="rounded-2xl border-2 border-dashed border-easy/50 bg-easy/5 p-6 text-center">
        <p className="text-2xl" aria-hidden="true">
          🎉
        </p>
        <h2 className="mt-2 font-serif text-2xl">{isNewsletter ? "You're subscribed" : "You're in"}</h2>
        <p className="mx-auto mt-2 max-w-md text-muted">
          {isNewsletter
            ? "I'll send new AI use cases and practical, no-hype tips as I add them. Unsubscribe anytime."
            : "Your full plan is unlocked below. Check your inbox for the PDF."}
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border-2 border-dashed border-easy/50 bg-easy/5 p-6 text-center">
      <p className="text-2xl" aria-hidden="true">
        {isNewsletter ? "✉️" : "🔓"}
      </p>
      <h2 className="mt-2 font-serif text-2xl">
        {isNewsletter
          ? "Want more where this came from?"
          : lockedCount > 0
            ? `Unlock ${lockedCount} more recommendation${lockedCount > 1 ? "s" : ""}`
            : "Get your plan as a PDF"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-muted">
        {isNewsletter
          ? "Subscribe and I'll send new AI use cases for your industry and practical, no-hype tips you can actually use. No spam."
          : lockedCount > 0
            ? "Enter your email to reveal the rest of your roadmap, get a downloadable PDF, and a shareable link to revisit anytime. No spam — just your plan."
            : "Enter your email to get your plan as a downloadable PDF and a shareable link to revisit anytime. No spam — just your plan."}
      </p>
      <form onSubmit={handleSubmit} className="mx-auto mt-4 flex max-w-md flex-col gap-3 sm:flex-row">
        {/* honeypot — hidden from humans, bots tend to fill it */}
        <input
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@business.com"
          aria-label="Your email address"
          className="flex-1 rounded-xl border border-ink/20 bg-white px-4 py-3 outline-none focus:border-easy"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-xl bg-easy px-6 py-3 font-semibold text-white transition-opacity disabled:opacity-50"
        >
          {status === "loading" ? "Sending…" : isNewsletter ? "Subscribe" : "Get full results"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-3 text-sm text-accent">Something went wrong. Please try again.</p>
      )}
    </section>
  );
}
