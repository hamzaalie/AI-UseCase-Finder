"use client";

import { useState } from "react";

interface Props {
  onInterpret: (description: string) => Promise<void>;
}

export default function ProblemDescriber({ onInterpret }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRead() {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      await onInterpret(text.trim());
    } catch {
      setError("Couldn't read that just now — you can still rate the tasks below.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-structure/30 bg-structure/5 p-4 sm:p-5">
      <label htmlFor="problem" className="block font-serif text-lg">
        Prefer to just tell me? <span className="text-sm font-normal text-muted">(optional)</span>
      </label>
      <p className="mt-1 text-sm text-muted">
        Describe in your own words what&apos;s slowing your business down, and I&apos;ll read it and
        pre-fill your pains below.
      </p>
      <textarea
        id="problem"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        maxLength={2000}
        placeholder="e.g. Leads message us and we're too slow to reply, quotes take me all evening, and half the people who book never actually buy…"
        className="mt-3 w-full resize-y rounded-xl border border-ink/20 bg-white px-3.5 py-3 text-sm outline-none focus:border-structure"
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-xs text-muted">{text.length}/2000</span>
        <button
          type="button"
          onClick={handleRead}
          disabled={loading || !text.trim()}
          className="rounded-xl bg-structure px-5 py-2.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Reading…" : "Read my situation ✨"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-accent">{error}</p>}
    </div>
  );
}
