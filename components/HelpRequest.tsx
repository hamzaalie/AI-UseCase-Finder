"use client";

import { FormEvent, useState } from "react";

interface Item {
  id: string;
  name: string;
}

interface Props {
  items: Item[];
  industry: string | null;
  planUrl: string;
  planPdfUrl: string;
}

type Status = "idle" | "loading" | "done" | "error";

export default function HelpRequest({ items, industry, planUrl, planPdfUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set(items.map((i) => i.id)));
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    if (selected.size === 0) {
      setErrorMsg("Tick at least one thing you'd like built.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/help-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          note,
          industry,
          selected: Array.from(selected),
          planUrl,
          planPdfUrl,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("done");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-xl bg-paper/10 p-5">
        <p className="font-serif text-xl">Got it — thank you. 🙌</p>
        <p className="mt-1 text-paper/80">
          Your request has landed in my inbox. I&apos;m Hamza — I&apos;ll personally email you at{" "}
          <span className="font-medium">{email}</span> soon about the {selected.size} thing
          {selected.size > 1 ? "s" : ""} you want built.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-block rounded-xl bg-accent px-6 py-3 font-semibold text-white"
      >
        Tell me what to build →
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-paper/10 p-5">
      <p className="font-semibold">Tick what you&apos;d like Netsol to build for you</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => {
          const checked = selected.has(item.id);
          return (
            <li key={item.id}>
              <label className="flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(item.id)}
                  className="mt-1 h-4 w-4 flex-shrink-0 accent-accent"
                />
                <span className={checked ? "text-paper" : "text-paper/60"}>{item.name}</span>
              </label>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="rounded-xl border border-paper/20 bg-paper px-3.5 py-2.5 text-ink outline-none placeholder:text-muted"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          aria-label="Your email"
          className="rounded-xl border border-paper/20 bg-paper px-3.5 py-2.5 text-ink outline-none placeholder:text-muted"
        />
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        maxLength={2000}
        placeholder="Anything else I should know? (optional)"
        className="mt-3 w-full resize-y rounded-xl border border-paper/20 bg-paper px-3.5 py-2.5 text-ink outline-none placeholder:text-muted"
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-xl bg-accent px-6 py-3 font-semibold text-white transition-opacity disabled:opacity-50"
        >
          {status === "loading" ? "Sending…" : "Send to Netsol"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-paper/70 underline decoration-paper/30 underline-offset-2 hover:text-paper"
        >
          Cancel
        </button>
      </div>
      {errorMsg && <p className="mt-3 text-sm text-accent">{errorMsg}</p>}
    </form>
  );
}
