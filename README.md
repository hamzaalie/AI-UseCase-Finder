# AI Use-Case Finder

A free, broad-audience web tool that shows any business owner the specific AI use cases that fit their business — ranked by impact vs. effort, with a real first step and a saveable to-do checklist.

Built by Hamza Ali · Netsol AI · [netsolai.cz](https://netsolai.cz)

## How it works

All recommendations come from a **hand-authored content library** ([`/data`](./data)), not a live AI model. The tool *matches and ranks* deterministically — it never *generates*, so it can never hallucinate or invent figures. Everything runs in the browser; the only server code is a tiny email-capture route.

- Pick an industry → tick the tasks that waste your time → get ranked use cases.
- Results split into **Quick Wins** (do-it-yourself) and **Bigger Projects** (worth building).
- Each card has an honest difficulty label and, where relevant, a note on when you *don't* need AI.
- A first-steps checklist saves progress to `localStorage`.

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- React local state only — no database, no auth, no external AI API
- Email capture via a single API route (stubbed if no provider key)
- Vercel Analytics

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Environment variables

Copy `.env.example` to `.env.local`. **Everything is optional** — with nothing set, the tool works fully: email capture runs in stub mode (logs + returns success) and the booking CTA stays hidden.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_BOOKING_URL` | Calendly/Cal.com link for the soft booking bridge. Hidden if unset. |
| `RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL` | **Option A** — emails you whenever someone leaves their address. `LEAD_FROM_EMAIL` must be a verified domain in production (sandbox sender only delivers to your own Resend account email). |
| `MAILERLITE_API_KEY` (+ `MAILERLITE_GROUP_ID`) | **Option B** — adds the lead to a MailerLite list so your sequence fires. |

The subscribe route ([`app/api/subscribe/route.ts`](./app/api/subscribe/route.ts)) auto-detects which provider is configured — set **one** (or neither). No SDKs, just `fetch`, so it deploys with zero config.

## Deploy to Vercel

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com) → **New Project** → import the repo → it auto-detects Next.js → **Deploy**. Zero config.
3. Add `EMAIL_PROVIDER_KEY` and `NEXT_PUBLIC_BOOKING_URL` in the Vercel dashboard when ready.
4. Point a subdomain (e.g. `tools.netsolai.cz`) at the Vercel project.

## Editing the content (the IP)

All recommendations live in [`/data`](./data) — edit these without touching logic:

- `tasks.ts` — the time-wasting tasks, in the owner's words.
- `solutions.ts` — the master use-case library (name, what, why, effort, difficulty, honest note).
- `steps.ts` — the first-step checklist per use case.
- `industries.ts` — industries and their impact-ordered task lists.

The matching logic lives in [`lib/match.ts`](./lib/match.ts) and is a pure, deterministic function.

## Replacing the OG image

[`public/og-image.png`](./public) is a placeholder. Replace it with a 1200×630 social share image.
