import { NextRequest, NextResponse } from "next/server";

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
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }

  try {
    if (process.env.RESEND_API_KEY) {
      await notifyViaResend(email, industry, tasks);
      return NextResponse.json({ ok: true, provider: "resend" });
    }

    if (process.env.MAILERLITE_API_KEY) {
      await subscribeViaMailerLite(email, industry, tasks);
      return NextResponse.json({ ok: true, provider: "mailerlite" });
    }

    // No provider configured — succeed so the flow works locally.
    console.log("[subscribe stub]", { email, industry, tasks });
    return NextResponse.json({ ok: true, stub: true });
  } catch (err) {
    console.error("[subscribe] provider error:", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't save your email just now. Please try again." },
      { status: 502 }
    );
  }
}

async function notifyViaResend(email: string, industry: string, tasks: string[]) {
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
      ].join("\n"),
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  }
}

async function subscribeViaMailerLite(email: string, industry: string, tasks: string[]) {
  const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      fields: { industry, tasks: tasks.join(",") },
      ...(process.env.MAILERLITE_GROUP_ID ? { groups: [process.env.MAILERLITE_GROUP_ID] } : {}),
    }),
  });

  // MailerLite returns 200/201 on success, 422 if already subscribed (treat as ok).
  if (!res.ok && res.status !== 422) {
    throw new Error(`MailerLite responded ${res.status}: ${await res.text()}`);
  }
}
