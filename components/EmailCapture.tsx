"use client";

import { FormEvent, useState } from "react";

interface Props {
  industry: string | null;
  tasks: string[];
  planUrl: string;
  planPdfUrl: string;
  lockedCount: number; // how many recommendations are still locked
  onSuccess: () => void;
}

type Status = "idle" | "loading" | "error";

export default function EmailCapture({ industry, tasks, planUrl, planPdfUrl, lockedCount, onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, industry, tasks, planUrl, planPdfUrl }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="rounded-2xl border-2 border-dashed border-easy/50 bg-easy/5 p-6 text-center">
      <p className="text-2xl" aria-hidden="true">
        🔓
      </p>
      <h2 className="mt-2 font-serif text-2xl">
        {lockedCount > 0 ? `Unlock ${lockedCount} more recommendation${lockedCount > 1 ? "s" : ""}` : "Get your full plan"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-muted">
        Enter your email to reveal the rest of your roadmap, get a downloadable PDF, and a shareable
        link to revisit anytime. No spam — just your plan.
      </p>
      <form onSubmit={handleSubmit} className="mx-auto mt-4 flex max-w-md flex-col gap-3 sm:flex-row">
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
          {status === "loading" ? "Unlocking…" : "Get full results"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-3 text-sm text-accent">Something went wrong. Please try again.</p>
      )}
    </section>
  );
}
