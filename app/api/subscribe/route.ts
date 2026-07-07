import { NextRequest, NextResponse } from "next/server";
import { isDisposableEmail, isHoneypotTripped } from "@/lib/spam";

/**
 * Email capture endpoint.
 *
 * Works in three modes, picked automatically from env vars (key-optional):
 *   1. RESEND_API_KEY set      → emails you a notification of the new lead.
 *   2. MAILERLITE_API_KEY set  → adds the lead to your MailerLite list (fires your sequence).
 *   3. nothing set             → "stub" mode: logs to the server and succeeds, so the UX works in dev.
 *
 * No SDKs, no extra dependencies — just fetch — so it deploys to Vercel with zero config.
 */

interface Payload {
  email: string;
  industry?: string;
  tasks?: string[];
  planUrl?: string;
  planPdfUrl?: string;
  hp?: string; // honeypot — real users never fill this
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Accept only an http(s) URL on the same host as the request — never arbitrary input. */
function isSafeUrl(url: string | undefined, req: NextRequest): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    return u.host === req.nextUrl.host;
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
  const industry = body.industry ?? "";
  const tasks = Array.isArray(body.tasks) ? body.tasks : [];
  // Only accept same-origin http(s) URLs — never store arbitrary input.
  const planUrl = isSafeUrl(body.planUrl, req) ? body.planUrl!.trim() : "";
  const planPdfUrl = isSafeUrl(body.planPdfUrl, req) ? body.planPdfUrl!.trim() : "";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }

  // Silently drop bots (honeypot) and throwaway emails — respond ok so they
  // don't retry, but never store or notify.
  if (isHoneypotTripped(body.hp) || isDisposableEmail(email)) {
    console.log("[subscribe blocked]", { email, honeypot: isHoneypotTripped(body.hp) });
    return NextResponse.json({ ok: true, skipped: true });
  }

  // Run every configured provider ALONGSIDE each other (not either/or):
  //   Resend     → emails you a notification
  //   MailerLite → adds the lead to your list + fires your nurture sequence
  const jobs: { name: string; run: () => Promise<void> }[] = [];
  if (process.env.RESEND_API_KEY) jobs.push({ name: "resend", run: () => notifyViaResend(email, industry, tasks, planUrl) });
  if (process.env.MAILERLITE_API_KEY) jobs.push({ name: "mailerlite", run: () => subscribeViaMailerLite(email, industry, tasks, planUrl, planPdfUrl) });

  if (jobs.length === 0) {
    // No provider configured — succeed so the flow works locally.
    console.log("[subscribe stub]", { email, industry, tasks });
    return NextResponse.json({ ok: true, stub: true });
  }

  const results = await Promise.allSettled(jobs.map((j) => j.run()));
  const succeeded = jobs.filter((_, i) => results[i].status === "fulfilled").map((j) => j.name);
  const failed = jobs.filter((_, i) => results[i].status === "rejected").map((j) => j.name);

  results.forEach((r, i) => {
    if (r.status === "rejected") console.error(`[subscribe] ${jobs[i].name} failed:`, r.reason);
  });

  // As long as at least one destination accepted the lead, the user succeeds —
  // we never lose a lead just because one provider hiccuped.
  if (succeeded.length > 0) {
    return NextResponse.json({ ok: true, providers: succeeded, failed: failed.length ? failed : undefined });
  }

  return NextResponse.json(
    { ok: false, error: "We couldn't save your email just now. Please try again." },
    { status: 502 }
  );
}

async function notifyViaResend(email: string, industry: string, tasks: string[], planUrl: string) {
  // Sender must be a verified domain in production. The Resend sandbox sender
  // (onboarding@resend.dev) only delivers to your own account email — fine for testing.
  const from = process.env.LEAD_FROM_EMAIL || "AI Use-Case Finder <onboarding@resend.dev>";
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!to) throw new Error("LEAD_NOTIFY_EMAIL is required when using RESEND_API_KEY");

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
      subject: `New AI Use-Case Finder lead — ${industry || "unknown industry"}`,
      text: [
        `New lead from the AI Use-Case Finder.`,
        ``,
        `Email:    ${email}`,
        `Industry: ${industry || "(not provided)"}`,
        `Tasks:    ${tasks.length ? tasks.join(", ") : "(none)"}`,
        `Plan:     ${planUrl || "(not provided)"}`,
      ].join("\n"),
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  }
}

async function subscribeViaMailerLite(
  email: string,
  industry: string,
  tasks: string[],
  planUrl: string,
  planPdfUrl: string
) {
  const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      fields: { industry, tasks: tasks.join(","), plan_url: planUrl, plan_pdf_url: planPdfUrl },
      ...(process.env.MAILERLITE_GROUP_ID ? { groups: [process.env.MAILERLITE_GROUP_ID] } : {}),
    }),
  });

  // MailerLite returns 200/201 on success, 422 if already subscribed (treat as ok).
  if (!res.ok && res.status !== 422) {
    throw new Error(`MailerLite responded ${res.status}: ${await res.text()}`);
  }
}
