"use client";

import { useState } from "react";
import type { MatchResult } from "@/lib/match";
import type { SelectionState } from "@/lib/share";
import { encodeState, planToText, shareUrl } from "@/lib/share";

interface Props {
  result: MatchResult;
  selection: SelectionState;
}

type Copied = "none" | "link" | "plan";

export default function ShareBar({ result, selection }: Props) {
  const [copied, setCopied] = useState<Copied>("none");

  async function copy(kind: "link" | "plan") {
    const text = kind === "link" ? shareUrl(selection) : planToText(result);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied("none"), 2000);
    } catch {
      // Clipboard blocked — surface the text so the user can copy manually.
      window.prompt("Copy this:", text);
    }
  }

  const btn =
    "inline-flex items-center gap-2 rounded-lg border border-ink/15 bg-white px-3.5 py-2 text-sm font-medium transition-colors hover:border-accent/60";

  const pdfHref = `/api/plan.pdf?${encodeState(selection)}`;

  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <a
        href={pdfHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btn} border-accent/40 text-accent`}
      >
        ⬇ Download PDF
      </a>
      <button type="button" onClick={() => copy("link")} className={btn}>
        {copied === "link" ? "✓ Link copied" : "🔗 Copy share link"}
      </button>
      <button type="button" onClick={() => copy("plan")} className={btn}>
        {copied === "plan" ? "✓ Plan copied" : "📋 Copy plan as text"}
      </button>
    </div>
  );
}
