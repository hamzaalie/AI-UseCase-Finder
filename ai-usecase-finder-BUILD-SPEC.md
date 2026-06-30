# AI Use-Case Finder — Complete Build Specification

> **For:** Claude Code (VS Code) build session
> **Owner:** Hamza Ali — Netsol AI (netsolai.cz)
> **Goal:** A free, broad-audience web tool that shows any business owner the specific AI use cases that fit their business — ranked by impact vs. effort, with a real first step and a to-do checklist. No login, no API, no running cost. Deployable on Vercel in one click.

---

## 1. The product in one paragraph

A business owner lands on the page. They pick their industry and tick the tasks that waste their time. The tool instantly returns a personalized, ranked set of AI use cases split into **Quick Wins** (easy, do-it-yourself) and **Bigger Projects** (worth getting built), each with a plain-English explanation, an honest difficulty/time estimate, and a concrete first step. They can tick those steps off as a to-do checklist. At the end they can optionally enter their email to get a deeper playbook. Everything runs in the browser — no backend, no AI API, no per-use cost.

---

## 2. Core principles (do not violate)

These are the rules that make this tool trustworthy and different from the ~8 competitors already live. Every build decision must respect them.

1. **Reliability over cleverness.** All recommendations come from a hand-authored content library, not a live AI model. The tool *matches and ranks*; it never *generates*. This means it can never hallucinate or say anything false.
2. **Personalize by relevance, never by fabricated numbers.** Do NOT show invented figures like "you're losing €3,200/month." The tool personalizes by showing the *right* use cases in the *right order* for their specific inputs. That feels personal and is 100% honest.
3. **Honesty layer.** The tool openly labels what users can do themselves for free vs. what's worth paying to have built. It can even tell them when a problem does NOT need AI. This honesty is the core differentiator — no faceless competitor does it.
4. **Impact vs. Effort framing.** Results are split into Quick Wins and Bigger Projects (this is the framework the best competitors and OpenAI use). Never a flat undifferentiated list.
5. **A person is behind it.** The tool is branded as built by Hamza / Netsol AI. Warm, plain-language, no corporate consulting tone.
6. **Speed.** A user should get from landing to results in under 60 seconds. No friction, no signup wall before value.

---

## 3. Tech stack (chosen for easy Vercel deploy)

- **Framework:** Next.js 14 (App Router) — first-class Vercel support, zero-config deploy.
- **Language:** TypeScript.
- **Styling:** Tailwind CSS.
- **State:** React local state only (`useState` / `useReducer`). No database, no server state.
- **Persistence:** `localStorage` for saving checklist progress (client-side only — fine here because this is a real app, not a sandboxed artifact).
- **Content data:** plain TypeScript files (`/data/*.ts`) — no CMS, no DB.
- **Email capture:** a single API route that forwards to an email provider (MailerLite/Beehiiv/Resend) via env var. Stubbed if no key present.
- **Analytics:** Vercel Analytics (free) + optional Plausible.
- **No external AI API. No backend database. No auth.**

> Why Next.js over plain HTML: it gives clean component structure, easy routing for future tools, built-in API route for email capture, and one-click Vercel deploy. It stays free because there's no server compute beyond the tiny email route.

---

## 4. File / folder structure

```
ai-usecase-finder/
├── app/
│   ├── layout.tsx              # root layout, fonts, metadata, analytics
│   ├── page.tsx                # the main tool (single-page flow)
│   ├── globals.css             # tailwind + design tokens
│   └── api/
│       └── subscribe/route.ts  # email capture endpoint (forwards to provider)
├── components/
│   ├── Hero.tsx                # headline + promise + start
│   ├── IndustryPicker.tsx      # step 1: choose industry (chips)
│   ├── TaskAudit.tsx           # step 2: tick time-wasting tasks
│   ├── Results.tsx             # ranked results: Quick Wins + Bigger Projects
│   ├── UseCaseCard.tsx         # single recommendation card
│   ├── Checklist.tsx           # to-do checklist with localStorage
│   ├── EmailCapture.tsx        # optional opt-in after results
│   ├── HonestyNote.tsx         # "you might not need AI for this" callouts
│   └── Footer.tsx
├── data/
│   ├── industries.ts           # industry list + which tasks/use-cases map to each
│   ├── tasks.ts                # the time-wasting tasks (owner's language)
│   ├── solutions.ts            # MASTER use-case library (the IP)
│   └── steps.ts                # first-step checklists per use case
├── lib/
│   ├── match.ts                # pure logic: inputs -> ranked, split results
│   └── storage.ts             # localStorage helpers for checklist
├── public/
│   └── og-image.png            # social share image
├── .env.example
├── tailwind.config.ts
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

---

## 5. The data model (the heart of the tool)

Four content files. This is where all the value lives. Keep them separate so content can be improved without touching logic.

### 5.1 `data/tasks.ts`
Each task is a thing the owner does that wastes time, named in THEIR words (not solution names).

```ts
export interface Task {
  id: string;
  label: string;       // what the owner calls it
  note: string;        // the pain, one line
}

export const TASKS: Task[] = [
  { id: "leadreply",  label: "Replying to new enquiries fast enough", note: "Leads go cold while you're busy" },
  { id: "followup",   label: "Following up with leads who go quiet",   note: "Deals die in the inbox" },
  { id: "faq",        label: "Answering the same questions over and over", note: "Hours lost to repeat questions" },
  { id: "scheduling", label: "Booking appointments / back-and-forth on times", note: "Six emails to find one slot" },
  { id: "invoicing",  label: "Chasing unpaid invoices",                note: "Money earned, not collected" },
  { id: "content",    label: "Writing posts, emails and marketing copy", note: "The weekly blank-page battle" },
  { id: "data",       label: "Copying info between tools / data entry", note: "Boring, error-prone, endless" },
  { id: "reporting",  label: "Pulling together reports and numbers",   note: "Decisions on gut, not data" },
  { id: "quoting",    label: "Writing quotes and proposals",           note: "Hours per proposal, by hand" },
  { id: "reviews",    label: "Remembering to ask for reviews & referrals", note: "Forgotten at the perfect moment" },
  { id: "intake",     label: "Wasting calls on people who never buy",  note: "Tyre-kickers drain your calendar" },
  { id: "notes",      label: "Writing up call notes and next steps",   note: "Things slip through the cracks" },
];
```

### 5.2 `data/solutions.ts`
The master library. One entry per AI use case. THIS IS THE PRODUCT'S IP.

```ts
export type Effort = "quickwin" | "project";   // Impact/Effort split
export type Difficulty = "diy" | "weekend" | "build";

export interface Solution {
  id: string;            // matches a task id it solves
  name: string;          // the system's name
  what: string;          // plain-English what it does
  why: string;           // why it matters / the payoff
  effort: Effort;        // quickwin or project (drives the split)
  difficulty: Difficulty;// diy / weekend / build (honest labelling)
  honestNote?: string;   // optional: when AI may NOT be needed
}

export const SOLUTIONS: Record<string, Solution> = {
  leadreply: {
    id: "leadreply",
    name: "Instant lead responder",
    what: "Every enquiry gets a personal reply in under a minute, day or night, with a booking link attached.",
    why: "The business that answers first usually wins the client. This makes you that business automatically.",
    effort: "project",
    difficulty: "weekend",
  },
  followup: {
    id: "followup",
    name: "Automatic follow-up sequence",
    what: "New leads get chased on day 1, 3 and 7 without you lifting a finger. It stops the moment they reply.",
    why: "Most deals close on the 4th touch. Most owners stop at the 1st. This closes that gap.",
    effort: "project",
    difficulty: "weekend",
  },
  faq: {
    id: "faq",
    name: "24/7 question answerer",
    what: "A site assistant trained on your prices, hours and FAQs answers repeat questions instantly and passes complex ones to you.",
    why: "Customers get answers in seconds; you get fewer interruptions.",
    effort: "project",
    difficulty: "build",
    honestNote: "If you only get a handful of the same 3 questions, you may not need AI here — just put clear answers on your website first.",
  },
  scheduling: {
    id: "scheduling",
    name: "Self-service booking",
    what: "People pick a slot from your real availability. Confirmations and reminders fire automatically.",
    why: "The six-email scheduling dance just ends.",
    effort: "quickwin",
    difficulty: "diy",
    honestNote: "This isn't really AI — it's a free booking tool (Calendly/Cal.com). Set it up yourself in 20 minutes before paying anyone.",
  },
  invoicing: {
    id: "invoicing",
    name: "Automatic invoice chaser",
    what: "Polite payment reminders fire on a schedule after an invoice goes unpaid — day 7, 14, 21.",
    why: "You get paid faster and never have the awkward chase conversation.",
    effort: "quickwin",
    difficulty: "diy",
    honestNote: "Most invoicing apps already do this for free — switch it on before buying a tool.",
  },
  content: {
    id: "content",
    name: "Content engine",
    what: "Turn one idea into a week of posts, emails and descriptions in your voice.",
    why: "Consistency without the daily blank-page battle.",
    effort: "quickwin",
    difficulty: "diy",
  },
  data: {
    id: "data",
    name: "No-more-copy-paste connector",
    what: "Information flows between your tools automatically instead of you re-typing it.",
    why: "Kills the most boring, error-prone half of admin.",
    effort: "project",
    difficulty: "weekend",
  },
  reporting: {
    id: "reporting",
    name: "Monday-morning report",
    what: "A short summary of leads, bookings and revenue builds itself and lands in your inbox weekly.",
    why: "Decisions on data, not gut feeling.",
    effort: "project",
    difficulty: "weekend",
  },
  quoting: {
    id: "quoting",
    name: "Fast quote / proposal drafts",
    what: "Feed in the brief, get a clean professional draft in minutes instead of hours.",
    why: "You send while competitors are still typing.",
    effort: "quickwin",
    difficulty: "diy",
  },
  reviews: {
    id: "reviews",
    name: "Review & referral asker",
    what: "An automated request fires at the perfect moment — right after a happy outcome.",
    why: "More reviews means higher ranking means more inbound, on autopilot.",
    effort: "quickwin",
    difficulty: "diy",
  },
  intake: {
    id: "intake",
    name: "Smart intake & qualification",
    what: "A few sharp questions sort serious buyers from browsers before they reach your calendar.",
    why: "You spend live time only on people who can say yes.",
    effort: "project",
    difficulty: "weekend",
  },
  notes: {
    id: "notes",
    name: "Call & meeting summariser",
    what: "Turns messy call notes or recordings into clean summaries and next-step lists automatically.",
    why: "Nothing important slips through.",
    effort: "quickwin",
    difficulty: "diy",
  },
};
```

### 5.3 `data/steps.ts`
The first real steps per use case — the to-do checklist content. The gap every competitor leaves open. Steps must be genuinely doable by the owner; never just "hire a developer."

```ts
export const STEPS: Record<string, string[]> = {
  leadreply: [
    "Write down the 3 questions every new lead asks you",
    "Pick a free form tool (Tally or Google Forms)",
    "Draft the auto-reply text (greeting + answer + booking link)",
    "Connect the form to send that reply automatically (Make/n8n free tier)",
  ],
  followup: [
    "Write 3 short follow-up messages (day 1, day 3, day 7)",
    "Pick an email tool you already use",
    "Set the sequence to stop if they reply or book",
    "Turn it on for one week and watch what happens",
  ],
  faq: [
    "List your 10 most-asked questions and clear answers",
    "Add those answers to your website first (often enough on its own)",
    "If volume is high, add a chat widget trained on that FAQ doc",
  ],
  scheduling: [
    "Create a free Calendly or Cal.com account",
    "Set your real available hours",
    "Add the booking link to your site, email signature and socials",
  ],
  invoicing: [
    "Open your invoicing app's settings",
    "Turn on automatic payment reminders (7/14/21 days)",
    "Write a polite reminder message once — it reuses it forever",
  ],
  content: [
    "Pick one idea you want to talk about this week",
    "Ask your AI tool for 5 angles on it for your audience",
    "Turn the best angle into a post, edit it to sound like you",
  ],
  data: [
    "List the two tools you copy data between most",
    "Check if they connect natively or via Make/Zapier/n8n",
    "Build one simple connection and test it on real data",
  ],
  reporting: [
    "Decide the 4 numbers you actually care about weekly",
    "Put them in one spreadsheet",
    "Automate a weekly summary email from that sheet",
  ],
  quoting: [
    "Save your best past proposal as a template",
    "Write a short brief format you can fill in fast",
    "Use AI to turn the brief into a draft, then you finalise",
  ],
  reviews: [
    "Write one short review-request message",
    "Decide the trigger moment (right after delivery/closing)",
    "Automate it to send at that moment every time",
  ],
  intake: [
    "Decide the 3 questions that reveal a serious buyer",
    "Add them to your contact form or booking flow",
    "Route only qualified leads to your calendar",
  ],
  notes: [
    "Pick where your call notes currently live",
    "Use an AI tool to summarise them into next steps",
    "Save the summary somewhere you'll actually see it",
  ],
};
```

### 5.4 `data/industries.ts`
Industries and the ordered task list relevant to each (order ≈ typical impact). Broad coverage — keep all of these.

```ts
export interface Industry {
  id: string;
  label: string;
  tasks: string[]; // ordered by typical relevance/impact
}

export const INDUSTRIES: Industry[] = [
  { id: "realestate",   label: "Real estate",                     tasks: ["leadreply","followup","intake","reviews","scheduling","content"] },
  { id: "trades",       label: "Trades / construction",           tasks: ["leadreply","quoting","scheduling","invoicing","followup","reviews"] },
  { id: "professional", label: "Accounting / legal / consulting", tasks: ["faq","intake","notes","invoicing","reporting","content"] },
  { id: "ecommerce",    label: "E-commerce / retail",             tasks: ["faq","content","data","reviews","reporting","followup"] },
  { id: "agency",       label: "Agency / freelance",              tasks: ["quoting","followup","content","data","reporting","leadreply"] },
  { id: "health",       label: "Clinic / wellness / salon",       tasks: ["scheduling","leadreply","followup","reviews","faq","intake"] },
  { id: "hospitality",  label: "Restaurant / hospitality",        tasks: ["faq","scheduling","reviews","content","followup","data"] },
  { id: "other",        label: "Something else",                  tasks: ["leadreply","followup","faq","scheduling","invoicing","content","reporting","quoting"] },
];
```

---

## 6. The matching logic (`lib/match.ts`)

Pure function. No AI, no randomness, fully deterministic — same inputs always give same output.

```ts
import { INDUSTRIES } from "@/data/industries";
import { SOLUTIONS, Solution } from "@/data/solutions";

export interface MatchResult {
  quickWins: Solution[];
  projects: Solution[];
}

export function getMatches(industryId: string, taskIds: string[]): MatchResult {
  const industry = INDUSTRIES.find(i => i.id === industryId);
  const order = industry?.tasks ?? [];

  // sort chosen tasks by the industry's impact order
  const sorted = [...taskIds].sort(
    (a, b) => (order.indexOf(a) === -1 ? 99 : order.indexOf(a)) -
              (order.indexOf(b) === -1 ? 99 : order.indexOf(b))
  );

  const solutions = sorted.map(id => SOLUTIONS[id]).filter(Boolean);

  return {
    quickWins: solutions.filter(s => s.effort === "quickwin"),
    projects:  solutions.filter(s => s.effort === "project"),
  };
}
```

The Results component renders **Quick Wins first** (easy momentum) then **Bigger Projects**. Within each group, order is already impact-ranked. The first Quick Win gets a "Start here" flag.

---

## 7. Screen flow (single page, progressive)

1. **Hero** — headline ("Stop guessing where AI fits. See it in your business."), one-line promise, "no email needed" reassurance.
2. **Step 1 — Industry** (chips). Selecting one reveals Step 2.
3. **Step 2 — Task audit** (checkable list, filtered to that industry). A "Find my AI use cases" button enables once ≥1 task is ticked.
4. **Results** —
   - One-line personalized summary.
   - **Quick Wins** section (green accent, "do it yourself" energy). First card flagged "Start here."
   - **Bigger Projects** section.
   - Each card: name, what, why, difficulty pill, and an honesty note where present.
5. **Checklist** — under results, a combined to-do list of first steps for their top picks, with checkboxes saved to localStorage so progress persists.
6. **Email capture** — optional, AFTER value delivered. "Want the full playbook for your top 3? Drop your email." Posts to `/api/subscribe`.
7. **Soft bridge** — one quiet line: "Some of these are worth doing yourself. Some are worth having built right. If you want help deciding — that's what I do." Link to book a call. No pressure.
8. **Footer** — Built by Hamza Ali · Netsol AI · netsolai.cz.

---

## 8. Email capture endpoint (`app/api/subscribe/route.ts`)

```ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, industry, tasks } = await req.json();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  const key = process.env.EMAIL_PROVIDER_KEY;
  if (!key) {
    // No provider configured yet — log and succeed so the UX works in dev.
    console.log("[subscribe stub]", { email, industry, tasks });
    return NextResponse.json({ ok: true, stub: true });
  }

  // EXAMPLE: MailerLite. Swap for your provider.
  // await fetch("https://connect.mailerlite.com/api/subscribers", {
  //   method: "POST",
  //   headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
  //   body: JSON.stringify({ email, fields: { industry, tasks: (tasks||[]).join(",") } }),
  // });

  return NextResponse.json({ ok: true });
}
```

`.env.example`:
```
EMAIL_PROVIDER_KEY=
NEXT_PUBLIC_BOOKING_URL=https://your-calendly-or-cal-link
```

---

## 9. Design direction

- **Feel:** editorial and confident, not SaaS-generic. A real person's tool, not a corporate consulting widget.
- **Type:** one serif for headings (warmth/authority), one clean sans for UI/body. System fonts or Google Fonts (Fraunces + Inter work well).
- **Color:** warm paper background, near-black ink, ONE bold accent (a warm vermilion/orange) used sparingly for the primary action and "Start here." Green reserved for Quick Wins / easy labels. Deep blue for structure/Bigger Projects.
- **Difficulty pills:** `diy` = green "Set up yourself · today", `weekend` = blue "A weekend project", `build` = orange "Worth getting built right".
- **Mobile-first.** Most LinkedIn traffic is mobile. Single column, big tap targets, chips and checkboxes easy to hit.
- **Accessibility:** semantic buttons, `aria-pressed` on toggles, respects `prefers-reduced-motion`.

---

## 10. Deploy to Vercel (instructions for the README)

1. `npx create-next-app@latest` already satisfied by this repo structure.
2. `npm install`
3. `npm run dev` to test locally at localhost:3000.
4. Push to a GitHub repo.
5. On vercel.com → New Project → import the repo → it auto-detects Next.js → Deploy. Zero config.
6. Add env vars in Vercel dashboard (`EMAIL_PROVIDER_KEY`, `NEXT_PUBLIC_BOOKING_URL`) when ready. Tool works without them (email runs in stub mode).
7. Custom domain: point a subdomain (e.g. `tools.netsolai.cz`) at the Vercel project.

---

## 11. What makes this different from the 8 existing competitors

(Build-relevant context, so decisions stay aligned.)

- Competitors are generic and corporate; this one has a **person behind it** (Hamza/Netsol AI) and a warm voice.
- Competitors give a flat list; this one uses **Quick Wins vs. Bigger Projects** (impact/effort).
- Competitors stop at "what"; this one gives a **real first step + a saveable to-do checklist** ("how").
- Competitors are pro-AI cheerleaders; this one has an **honesty layer** that says when you DON'T need AI. This is the trust differentiator and the reason people share it.
- All free, no signup wall, value before email — same as the best ones, kept as table stakes.

---

## 12. Build order (so it ships in stages)

1. Scaffold Next.js + Tailwind + the 4 data files. Get matching logic working with console output.
2. Build Hero → IndustryPicker → TaskAudit → Results (Quick Wins / Projects split). This is a usable tool — ship it.
3. Add Checklist with localStorage persistence.
4. Add EmailCapture + the `/api/subscribe` route (stub mode).
5. Add HonestyNote rendering + the soft booking bridge.
6. Polish design, add OG image + metadata, deploy to Vercel.

Each stage is launchable. Don't wait for stage 6 to go live.

---

## 13. Explicit non-goals (don't build these)

- ❌ No live AI / LLM calls (keeps it free and reliable).
- ❌ No fabricated money/loss numbers.
- ❌ No user accounts or database.
- ❌ No login wall before results.
- ❌ No "boost engagement" / automation gimmicks.
- ❌ Don't expand scope into 10 screens — keep the 60-second flow sacred.
