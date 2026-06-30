"use client";

import { FormEvent, useState } from "react";

interface Props {
  industry: string | null;
  tasks: string[];
}

type Status = "idle" | "loading" | "done" | "error";

export default function EmailCapture({ industry, tasks }: Props) {
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
        body: JSON.stringify({ email, industry, tasks }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <section className="rounded-2xl border border-easy/30 bg-easy/5 p-6">
        <h2 className="font-serif text-2xl">You're in. 🎉</h2>
        <p className="mt-2 text-muted">
          The full playbook for your top picks is on its way. Check your inbox.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-ink/10 bg-white/70 p-6">
      <h2 className="font-serif text-2xl">Want the full playbook for your top 3?</h2>
      <p className="mt-2 text-muted">
        Drop your email and I'll send a deeper guide — tools, templates and the exact setup. No spam.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@business.com"
          aria-label="Your email address"
          className="flex-1 rounded-xl border border-ink/20 bg-white px-4 py-3 outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-xl bg-accent px-6 py-3 font-semibold text-white transition-opacity disabled:opacity-50"
        >
          {status === "loading" ? "Sending…" : "Send me the playbook"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-3 text-sm text-accent">Something went wrong. Please try again.</p>
      )}
    </section>
  );
}
