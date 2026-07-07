import { NextRequest, NextResponse } from "next/server";
import { SOLUTIONS } from "@/data/solutions";
import { INDUSTRIES } from "@/data/industries";
import { isDisposableEmail, isHoneypotTripped } from "@/lib/spam";

// Emails Netsol AI when a visitor asks for help building specific use cases.
// Uses Resend if configured; otherwise logs and succeeds so dev works.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Payload {
  email?: string;
  name?: string;
  note?: string;
  industry?: string;
  selected?: string[];
  planUrl?: string;
  planPdfUrl?: string;
  hp?: string; // honeypot
}

function isSafeUrl(url: string | undefined, req: NextRequest): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return (u.protocol === "http:" || u.protocol === "https:") && u.host === req.nextUrl.host;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const name = (body.name ?? "").trim().slice(0, 120);
  const note = (body.note ?? "").trim().slice(0, 2000);
  const industryLabel =
    INDUSTRIES.find((i) => i.id === body.industry)?.label ?? "(not provided)";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }

  // Drop bots + throwaway emails silently.
  if (isHoneypotTripped(body.hp) || isDisposableEmail(email)) {
    console.log("[help-request blocked]", { email, honeypot: isHoneypotTripped(body.hp) });
    return NextResponse.json({ ok: true });
  }

  const selectedNames = (Array.isArray(body.selected) ? body.selected : [])
    .filter((id) => SOLUTIONS[id])
    .map((id) => SOLUTIONS[id].name);

  if (selectedNames.length === 0) {
    return NextResponse.json({ ok: false, error: "Pick at least one thing to build." }, { status: 400 });
  }

  const planUrl = isSafeUrl(body.planUrl, req) ? body.planUrl!.trim() : "";
  const planPdfUrl = isSafeUrl(body.planPdfUrl, req) ? body.planPdfUrl!.trim() : "";

  const text = [
    `New build request from the AI Use-Case Finder.`,
    ``,
    `From:     ${name ? `${name} <${email}>` : email}`,
    `Industry: ${industryLabel}`,
    ``,
    `Wants Netsol to build:`,
    ...selectedNames.map((n) => `  • ${n}`),
    ``,
    note ? `Their note:\n${note}` : `Their note: (none)`,
    ``,
    planUrl ? `Plan:     ${planUrl}` : ``,
    planPdfUrl ? `Plan PDF: ${planPdfUrl}` : ``,
  ]
    .filter((l) => l !== "")
    .join("\n");

  try {
    if (process.env.RESEND_API_KEY) {
      const from = process.env.LEAD_FROM_EMAIL || "AI Use-Case Finder <onboarding@resend.dev>";
      const to = process.env.LEAD_NOTIFY_EMAIL;
      if (!to) throw new Error("LEAD_NOTIFY_EMAIL is required");

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: email,
          subject: `Build request — ${industryLabel} — ${selectedNames.length} item${selectedNames.length > 1 ? "s" : ""}`,
          text,
        }),
      });
      if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
      return NextResponse.json({ ok: true });
    }

    // No provider — log and succeed so the flow works in dev.
    console.log("[help-request stub]", text);
    return NextResponse.json({ ok: true, stub: true });
  } catch (err) {
    console.error("[help-request] error:", err);
    return NextResponse.json(
      { ok: false, error: "Couldn't send that just now. Please try again." },
      { status: 502 }
    );
  }
}
