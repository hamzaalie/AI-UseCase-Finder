export type Effort = "quickwin" | "project"; // Impact/Effort split
export type Difficulty = "diy" | "weekend" | "build";
export type ToolTier = "free" | "freemium" | "paid";

export type Category =
  | "Sales & leads"
  | "Marketing"
  | "Operations"
  | "Admin & finance"
  | "Customer service";

export interface Tool {
  name: string;
  url: string;
  tier: ToolTier;
  note?: string;
}

export interface StackLayer {
  layer: string;
  tool: string;
  does: string;
}

export interface Phase {
  title: string;
  detail: string;
}

/** One level of investment for the same use case. */
export interface Tier {
  level: "Quick Win" | "Workflow Fix" | "Built right";
  time: string; // honest effort/time
  what: string; // what you actually do at this level
  impact: string; // HONEST framing — no invented percentages
}

export interface Playbook {
  howItWorks: string;
  stack: StackLayer[];
  phases: Phase[];
  watchOuts: string[];
  worthItWhen: string;
  skipIf: string;
  metric: string;
  timeToValue: string;
}

export interface Solution {
  id: string;
  name: string;
  category: Category;
  problem: string; // THE PROBLEM — one punchy, honest line
  helps: string[]; // How AI helps — 3 scannable points
  what: string;
  why: string;
  effort: Effort;
  difficulty: Difficulty;
  impact: number;
  setupTime: string;
  cost: string;
  tools: Tool[];
  tiers: Tier[]; // Quick Win / Workflow Fix / Built right
  synergies?: string[];
  honestNote?: string;
  notReallyAI?: boolean;
  playbook: Playbook;
}

export const SOLUTIONS: Record<string, Solution> = {
  leadreply: {
    id: "leadreply",
    name: "Instant lead responder",
    category: "Sales & leads",
    problem: "Enquiries land while you're busy, and by the time you reply the lead has already messaged someone else.",
    helps: [
      "Sends a personal reply within a minute, day or night",
      "Answers the 2–3 things every lead asks, with a booking link attached",
      "Flags anything tricky to you instead of guessing",
    ],
    what: "Every enquiry gets a personal, on-brand reply in under a minute — day or night — that answers the obvious questions and hands them a booking link.",
    why: "Responding within 5 minutes makes a lead far more likely to convert than responding an hour later. This makes you the business that always answers first, without you watching the inbox.",
    effort: "project",
    difficulty: "weekend",
    impact: 9,
    setupTime: "A weekend to set up, then hands-off",
    cost: "Free to start (free tiers), ~€0–25/mo at volume",
    synergies: ["followup", "intake", "scheduling"],
    tools: [
      { name: "Tally", url: "https://tally.so", tier: "free", note: "Capture the enquiry" },
      { name: "Make", url: "https://make.com", tier: "freemium", note: "Trigger the instant reply" },
      { name: "Cal.com", url: "https://cal.com", tier: "freemium", note: "Attach a booking link" },
    ],
    tiers: [
      { level: "Quick Win", time: "This week", what: "Write one strong auto-reply template with your top answers + a booking link, and set it as an autoresponder on your form/inbox.", impact: "No enquiry sits unanswered — even the first reply beats going silent." },
      { level: "Workflow Fix", time: "A weekend", what: "Form → automation (Make/n8n) → AI drafts a tailored reply from the enquiry + your FAQ, sends it, and books the call.", impact: "Personal replies in under a minute without you touching the inbox." },
      { level: "Built right", time: "2–3 weeks", what: "A robust responder wired to your CRM with routing rules, edge-case handling, and logging — fully hands-off.", impact: "Reliable speed-to-lead at scale; nothing slips even on your busiest days." },
    ],
    playbook: {
      howItWorks:
        "Your contact form (or inbox) becomes the trigger. The moment an enquiry lands, an automation reads it, drops the details into a draft using an AI model, and sends a tailored reply that greets them by name, answers the 2–3 things everyone asks, and links to your calendar. Genuinely tricky enquiries get flagged to you instead of auto-answered.",
      stack: [
        { layer: "Capture", tool: "Tally / Google Forms", does: "Collects the enquiry in a structured way (name, need, budget)." },
        { layer: "Orchestrator", tool: "Make / n8n", does: "Watches for new submissions and runs the steps in order." },
        { layer: "Brain", tool: "Claude / GPT via API", does: "Writes a personal reply from the enquiry + your FAQ snippets." },
        { layer: "Action", tool: "Gmail / your email", does: "Sends the reply; attaches the Cal.com booking link." },
      ],
      phases: [
        { title: "Day 1 — the template", detail: "Write the 3 questions every lead asks and the perfect answer to each. This becomes the AI's source material so it never invents facts." },
        { title: "Weekend — wire it up", detail: "Connect form → Make → AI draft → send. Test with 5 fake enquiries until the tone is yours." },
        { title: "Week 2 — add the safety net", detail: "Add a rule: if the enquiry mentions price disputes, complaints, or anything off-script, route it straight to you." },
      ],
      watchOuts: [
        "Don't let the AI quote prices or make promises — feed it only approved answers, or it will improvise.",
        "Always include a one-line 'a human will follow up shortly' so it never feels like a dead-end bot.",
        "Log every auto-reply somewhere you can skim, especially the first two weeks.",
      ],
      worthItWhen: "You get more than a handful of enquiries a week and you can't always reply within the hour.",
      skipIf: "You get a couple of enquiries a week and already reply fast — a saved reply template is enough.",
      metric: "Median time-to-first-reply (aim to drop it from hours to under a minute) and reply→booking rate.",
      timeToValue: "Live in a weekend; you'll see faster bookings within the first week.",
    },
  },

  followup: {
    id: "followup",
    name: "Automatic follow-up sequence",
    category: "Sales & leads",
    problem: "Leads go quiet, life gets busy, and the deals that just needed one more nudge quietly die in your inbox.",
    helps: [
      "Chases quiet leads on day 1, 3 and 7 automatically",
      "Each message is short and human, not 'just checking in'",
      "Stops the instant they reply or book — nobody gets over-chased",
    ],
    what: "Leads who go quiet get a short, friendly nudge on day 1, 3 and 7 — automatically — and the sequence stops the instant they reply or book.",
    why: "Most sales need several touches, but most owners stop after one. This closes the gap between 'they went quiet' and 'I forgot to chase' without you tracking anyone manually.",
    effort: "project",
    difficulty: "weekend",
    impact: 8,
    setupTime: "A weekend to write + wire up",
    cost: "Free on most email tools' starter tiers",
    synergies: ["leadreply", "intake", "reviews"],
    tools: [
      { name: "MailerLite", url: "https://mailerlite.com", tier: "freemium", note: "Automations on free tier" },
      { name: "Brevo", url: "https://brevo.com", tier: "freemium", note: "Email + SMS sequences" },
      { name: "n8n", url: "https://n8n.io", tier: "free", note: "Self-host the logic for free" },
    ],
    tiers: [
      { level: "Quick Win", time: "Today", what: "Write 3 short follow-up messages and set a calendar reminder to send them manually to anyone who goes quiet.", impact: "You stop forgetting the follow-up that closes the deal." },
      { level: "Workflow Fix", time: "A weekend", what: "Load the 3 messages into an email tool as a timed sequence with an exit-on-reply rule.", impact: "Every lead gets chased on schedule, hands-off, with no awkward over-chasing." },
      { level: "Built right", time: "2–3 weeks", what: "Branching sequences by lead type, across email + SMS, wired to your CRM with smart exit conditions.", impact: "A follow-up engine that adapts to each lead — the compounding win over time." },
    ],
    playbook: {
      howItWorks:
        "When a lead enters a list (from your form or CRM) a timed sequence starts. Each message is short, human, and adds a reason to reply — not 'just checking in'. A reply or a booking trips an exit condition so nobody gets chased after they've already engaged.",
      stack: [
        { layer: "List", tool: "MailerLite / Brevo", does: "Holds leads and runs the timed automation." },
        { layer: "Trigger", tool: "Form or CRM", does: "Adds a new lead to the sequence automatically." },
        { layer: "Exit logic", tool: "Reply / booking detection", does: "Stops the sequence the moment they engage." },
      ],
      phases: [
        { title: "Day 1 — write three messages", detail: "Day 1: recap + a useful resource. Day 3: a relevant case/result. Day 7: a soft 'should I close your file?' Each under 80 words." },
        { title: "Weekend — build the flow", detail: "Set delays (1/3/7 days) and the exit condition on reply or booking. Send all three to yourself first." },
        { title: "Week 2 — tune", detail: "Check which message gets replies and rewrite the weakest one. Add an SMS step if your audience prefers texts." },
      ],
      watchOuts: [
        "If exit-on-reply isn't set correctly you'll chase people who already said yes — embarrassing and trust-killing.",
        "Keep it to 3 touches; more reads as desperate for most service businesses.",
        "Personalise the first line at minimum — generic blasts get ignored and hurt deliverability.",
      ],
      worthItWhen: "Leads regularly go cold simply because you got busy and forgot to follow up.",
      skipIf: "You only take a few clients a month and follow up personally already — automation adds little here.",
      metric: "Reply rate per message and overall lead→customer conversion before vs. after.",
      timeToValue: "Built in a weekend; replies start landing within the first 7-day cycle.",
    },
  },

  faq: {
    id: "faq",
    name: "24/7 question answerer",
    category: "Customer service",
    problem: "The same handful of questions interrupt your day on repeat — and go unanswered every evening and weekend.",
    helps: [
      "Answers repeat questions instantly, around the clock",
      "Trained only on your prices/hours/policies, so it can't make things up",
      "Passes anything complex or sensitive straight to you",
    ],
    what: "A site assistant trained only on your prices, hours, policies and FAQs answers repeat questions instantly and quietly passes anything complex to you.",
    why: "Customers get correct answers in seconds at midnight; you get a quieter inbox and fewer 'are you open?' interruptions.",
    effort: "project",
    difficulty: "build",
    impact: 7,
    setupTime: "A few days to train + test properly",
    cost: "~€0–40/mo depending on volume",
    synergies: ["intake", "scheduling"],
    tools: [
      { name: "Chatbase", url: "https://chatbase.co", tier: "freemium", note: "Train on your docs/site" },
      { name: "Crisp", url: "https://crisp.chat", tier: "freemium", note: "Chat widget + AI add-on" },
    ],
    honestNote:
      "If you only get a handful of the same 3 questions, you may not need AI here — just put clear answers on your website first.",
    tiers: [
      { level: "Quick Win", time: "An afternoon", what: "Write your top 15–20 questions and answers into a clear FAQ page on your site.", impact: "Deflects a real share of questions instantly — often enough on its own." },
      { level: "Workflow Fix", time: "A few days", what: "Feed that FAQ doc into a chat widget locked to 'answer only from sources', with a handoff to you for anything else.", impact: "After-hours questions get answered; your inbox gets noticeably quieter." },
      { level: "Built right", time: "2–4 weeks", what: "An assistant trained across your full knowledge base, wired into your site and inbox with escalation + review of transcripts.", impact: "Consistent, correct answers at any hour without adding a support hire." },
    ],
    playbook: {
      howItWorks:
        "You give the assistant a single source of truth — a doc with your real prices, hours, policies and answers. It answers only from that document (so it can't invent facts) and, when it's unsure or the question is sensitive, it collects the visitor's details and hands off to you rather than guessing.",
      stack: [
        { layer: "Knowledge", tool: "One FAQ document", does: "The only thing the bot is allowed to answer from." },
        { layer: "Assistant", tool: "Chatbase / Crisp AI", does: "Reads the doc and answers visitor questions in plain language." },
        { layer: "Handoff", tool: "Email / inbox", does: "Escalates anything off-script with the visitor's contact details." },
      ],
      phases: [
        { title: "First — the FAQ doc", detail: "Write your 15–20 real questions and exact answers. This is 80% of the work and the bit that makes it trustworthy." },
        { title: "Day 2 — train + restrict", detail: "Upload the doc, turn ON 'only answer from sources', and set the fallback to capture details and notify you." },
        { title: "Week 1 — review transcripts", detail: "Read what people actually asked, add the gaps to the doc, and refine the fallback wording." },
      ],
      watchOuts: [
        "Leaving the model free to answer from general knowledge is how you get confidently-wrong prices — lock it to your doc.",
        "Stale answers erode trust fast; assign one person to keep the FAQ doc current.",
        "Make the 'talk to a human' path obvious on every reply.",
      ],
      worthItWhen: "You field the same questions dozens of times a week, including outside business hours.",
      skipIf: "It's the same 3 questions from everyone — just put those answers clearly on your site first (cheaper, instant, no risk).",
      metric: "Share of conversations resolved without you, and number of after-hours questions answered.",
      timeToValue: "A few days to do properly; deflection is visible within the first week of traffic.",
    },
  },

  scheduling: {
    id: "scheduling",
    name: "Self-service booking",
    category: "Operations",
    problem: "Booking a simple appointment turns into six emails of 'does Tuesday work?' — and people no-show anyway.",
    helps: [
      "People self-book from your real, live availability",
      "Confirmations and reminders fire automatically",
      "Reschedules and cancellations update everything for you",
    ],
    what: "People pick a slot from your real, live availability. Confirmations, reminders and reschedules all fire automatically.",
    why: "The six-email 'does Tuesday work?' dance just ends — and no-shows drop because reminders go out on their own.",
    effort: "quickwin",
    difficulty: "diy",
    impact: 7,
    setupTime: "About 20 minutes",
    cost: "Free",
    synergies: ["leadreply", "intake"],
    tools: [
      { name: "Cal.com", url: "https://cal.com", tier: "freemium", note: "Open-source, generous free tier" },
      { name: "Calendly", url: "https://calendly.com", tier: "freemium", note: "Easiest to start" },
    ],
    honestNote:
      "This isn't really AI — it's a free booking tool (Calendly/Cal.com). Set it up yourself in 20 minutes before paying anyone.",
    notReallyAI: true,
    tiers: [
      { level: "Quick Win", time: "20 minutes", what: "Create a free Cal.com/Calendly page, connect your calendar, turn on reminders, and share the link everywhere.", impact: "The scheduling back-and-forth ends today; reminders cut no-shows." },
      { level: "Workflow Fix", time: "An hour", what: "Add qualifying questions, buffers, and auto-routing to the right meeting type or team member.", impact: "Only the right people, in the right slots, with prep time protected." },
      { level: "Built right", time: "1–2 weeks", what: "Booking wired into your CRM/intake with follow-ups and no-show recovery built in.", impact: "A booking flow that also nurtures and recovers — not just a calendar." },
    ],
    playbook: {
      howItWorks:
        "You connect your calendar once. The tool shows only your genuinely free slots, lets people book themselves, writes the event to your calendar, and sends automatic confirmations + reminders by email/SMS. Reschedules and cancellations update everything without you touching it.",
      stack: [
        { layer: "Calendar", tool: "Google / Outlook", does: "The source of truth for what's actually free." },
        { layer: "Booking page", tool: "Cal.com / Calendly", does: "Public page where people self-book real slots." },
        { layer: "Reminders", tool: "Built-in email/SMS", does: "Cuts no-shows with automatic nudges." },
      ],
      phases: [
        { title: "20 minutes — set it up", detail: "Connect calendar, set your real working hours and buffers, choose meeting lengths, turn on reminders." },
        { title: "Same day — put the link everywhere", detail: "Add it to your site, email signature, social bios and the auto-reply from your lead responder." },
        { title: "Optional — qualify first", detail: "Add a couple of questions to the booking form so only the right people land on your calendar." },
      ],
      watchOuts: [
        "Set buffers and daily limits or you'll get booked back-to-back with no travel/prep time.",
        "Double-check timezone handling if you serve people in other regions.",
      ],
      worthItWhen: "Almost always — even a few bookings a week. It's free and takes 20 minutes.",
      skipIf: "You truly never schedule calls or appointments.",
      metric: "No-show rate (should fall with reminders) and emails saved per booking.",
      timeToValue: "Live in 20 minutes; saves time on the very first booking.",
    },
  },

  invoicing: {
    id: "invoicing",
    name: "Automatic invoice chaser",
    category: "Admin & finance",
    problem: "You've done the work but the money's still out there — and chasing it is awkward and keeps slipping.",
    helps: [
      "Sends polite, escalating reminders on a schedule (day 7, 14, 21)",
      "Stops automatically the moment payment clears",
      "Removes the awkward 'just chasing this' conversation entirely",
    ],
    what: "Polite, escalating payment reminders fire on a schedule after an invoice goes unpaid — day 7, 14, 21 — until it's settled.",
    why: "You get paid faster, your cash flow steadies, and you never have to send the awkward 'just chasing this' email yourself.",
    effort: "quickwin",
    difficulty: "diy",
    impact: 6,
    setupTime: "About 30 minutes in your existing tool",
    cost: "Free (already in most invoicing apps)",
    tools: [
      { name: "Wave", url: "https://waveapps.com", tier: "free", note: "Free invoicing + reminders" },
      { name: "Stripe Invoicing", url: "https://stripe.com/invoicing", tier: "freemium", note: "Auto reminders built in" },
    ],
    honestNote: "Most invoicing apps already do this for free — switch it on before buying a tool.",
    notReallyAI: true,
    tiers: [
      { level: "Quick Win", time: "30 minutes", what: "Turn on automatic reminders in your existing invoicing app and write the 3 reminder messages once.", impact: "Overdue invoices chase themselves — you stop losing time and nerve on it." },
      { level: "Workflow Fix", time: "An hour", what: "Add one-click payment links to reminders and a Slack/email alert when something stays unpaid past day 21.", impact: "Faster payment and nothing slips past the awkward stage unnoticed." },
      { level: "Built right", time: "1–2 weeks", what: "Reminders + dunning wired to your accounting system with escalation rules and reporting.", impact: "Steadier cash flow with zero manual chasing across every client." },
    ],
    playbook: {
      howItWorks:
        "Your invoicing tool already tracks which invoices are overdue. You turn on its reminder feature, write three reminder messages once (gentle → firmer → final), and set them to send on a schedule. The tool stops the moment payment clears.",
      stack: [
        { layer: "Invoicing", tool: "Wave / Stripe / your tool", does: "Tracks due dates and payment status." },
        { layer: "Reminders", tool: "Built-in automation", does: "Sends the scheduled nudges and stops on payment." },
      ],
      phases: [
        { title: "30 minutes — switch it on", detail: "Find reminder settings, enable 7/14/21-day reminders, write the three messages once." },
        { title: "Optional — add a payment link", detail: "Embed a one-click pay link in each reminder so settling is frictionless." },
      ],
      watchOuts: [
        "Keep tone warm on the first reminder — most late payers just forgot, not dodging you.",
        "Make sure reminders genuinely stop on payment or you'll annoy people who already paid.",
      ],
      worthItWhen: "You regularly carry unpaid invoices and chasing them is eating your time or nerves.",
      skipIf: "Clients pay on time or upfront — there's nothing to chase.",
      metric: "Average days-to-payment before vs. after, and value of overdue invoices outstanding.",
      timeToValue: "30 minutes to set up; affects the very next overdue invoice.",
    },
  },

  content: {
    id: "content",
    name: "Content engine",
    category: "Marketing",
    problem: "You know content would help, but the blank page wins every busy week and you go quiet for months.",
    helps: [
      "Turns one idea into a week of posts, emails and descriptions",
      "Writes in your voice using a reusable brand brief",
      "Kills the blank-page problem so marketing actually happens",
    ],
    what: "Turn one idea into a week of posts, emails and product descriptions — in your voice, not generic AI mush.",
    why: "Consistency without the daily blank-page battle, so marketing keeps happening even in your busy weeks.",
    effort: "quickwin",
    difficulty: "diy",
    impact: 6,
    setupTime: "Start today, ~30 min per batch",
    cost: "Free tier works; ~€18/mo for heavy use",
    synergies: ["socials", "reviews"],
    tools: [
      { name: "Claude", url: "https://claude.ai", tier: "freemium", note: "Best for on-brand long-form" },
      { name: "ChatGPT", url: "https://chat.openai.com", tier: "freemium", note: "Fast idea-to-draft" },
    ],
    tiers: [
      { level: "Quick Win", time: "Today", what: "Write a one-page brand brief (voice, audience, examples) and use it to turn one idea into a week of drafts you edit.", impact: "Content starts happening again — the blank page stops winning." },
      { level: "Workflow Fix", time: "A few hours", what: "Build reusable prompt templates per format and a simple content calendar you batch weekly.", impact: "A repeatable rhythm — a week of on-brand content in ~30 minutes." },
      { level: "Built right", time: "1–2 weeks", what: "A repurposing pipeline that turns each long piece (call, blog, talk) into posts, emails and captions automatically.", impact: "One input, a week of channels — consistency without the grind." },
    ],
    playbook: {
      howItWorks:
        "You build a reusable 'brand brief' — who you serve, your tone, words you'd never use, three example posts you like. You paste that brief in once per session, then give the AI a single idea and ask for a week of angles. You edit the best ones so they sound like you. The brief is what stops the output sounding generic.",
      stack: [
        { layer: "Brand brief", tool: "A saved prompt/doc", does: "Teaches the AI your voice and audience every session." },
        { layer: "Drafting", tool: "Claude / ChatGPT", does: "Turns one idea into many on-brand drafts." },
        { layer: "Edit pass", tool: "You", does: "The 10% of human edit that makes it yours." },
      ],
      phases: [
        { title: "First — write the brand brief", detail: "Audience, tone, banned phrases, 3 sample posts. Save it — you reuse it forever." },
        { title: "Each session — batch", detail: "Paste brief + one idea, ask for 5 angles + a week of posts, pick the best, edit for 10 minutes." },
        { title: "Level up — repurpose", detail: "Feed a single long piece (call, blog, talk) and have it spun into posts, an email and captions." },
      ],
      watchOuts: [
        "Publishing raw AI output is obvious and damages trust — always do the human edit pass.",
        "Don't ask it for facts/stats about your business; give it the facts.",
        "Drift happens — refresh the brand brief every month or two.",
      ],
      worthItWhen: "You know content helps but you keep skipping it because starting from blank is the hard part.",
      skipIf: "You already have a writer or a steady rhythm that works — don't fix what isn't broken.",
      metric: "Posts published per month (consistency) and engagement on AI-assisted vs. old posts.",
      timeToValue: "Today — first usable batch in your first 30-minute session.",
    },
  },

  data: {
    id: "data",
    name: "No-more-copy-paste connector",
    category: "Operations",
    problem: "You re-type the same information between tools all day — it's boring, error-prone, and never ends.",
    helps: [
      "Moves information between your tools automatically",
      "No more re-typing, no more 'forgot to update the sheet'",
      "Kills the most error-prone half of your admin",
    ],
    what: "Information flows between your tools automatically — form to CRM to spreadsheet to inbox — instead of you re-typing it.",
    why: "It kills the most boring, error-prone half of admin and removes the 'I forgot to update the sheet' failure mode.",
    effort: "project",
    difficulty: "weekend",
    impact: 7,
    setupTime: "A weekend per connection",
    cost: "Free tiers cover low volume; ~€9–20/mo above",
    synergies: ["reporting", "leadreply"],
    tools: [
      { name: "Make", url: "https://make.com", tier: "freemium", note: "Visual, generous free ops" },
      { name: "Zapier", url: "https://zapier.com", tier: "freemium", note: "Most integrations" },
      { name: "n8n", url: "https://n8n.io", tier: "free", note: "Self-host for free" },
    ],
    tiers: [
      { level: "Quick Win", time: "An hour", what: "Turn on the native integration between the two tools you copy between most (many already connect).", impact: "One painful copy-paste route disappears immediately." },
      { level: "Workflow Fix", time: "A weekend", what: "Build one automation (Make/Zapier) for your most frequent, most error-prone data route and test it on real data.", impact: "Typos and forgotten updates gone on that flow; hours back each week." },
      { level: "Built right", time: "2–4 weeks", what: "Your key tools connected end-to-end with error alerts and monitoring.", impact: "The boring half of admin runs itself, reliably, across the business." },
    ],
    playbook: {
      howItWorks:
        "You pick the single most painful copy-paste route you do (e.g. 'new form submission → add to CRM → add row to revenue sheet → Slack the team'). An automation tool watches the trigger and performs each step automatically, every time, with no typos and no forgetting.",
      stack: [
        { layer: "Trigger", tool: "Form / email / app event", does: "The thing that kicks off the flow." },
        { layer: "Connector", tool: "Make / Zapier / n8n", does: "Moves and reshapes the data between tools." },
        { layer: "Destinations", tool: "CRM / Sheets / Slack", does: "Where the data needs to end up." },
      ],
      phases: [
        { title: "Pick ONE route", detail: "List the copy-paste tasks you do weekly; choose the most frequent + most error-prone one." },
        { title: "Weekend — build + test", detail: "Map trigger → steps → destinations. Run it on real data and check every field lands correctly." },
        { title: "Then expand", detail: "Once one works and you trust it, automate the next route. Don't try to do all at once." },
      ],
      watchOuts: [
        "Automating a messy process just makes the mess faster — clean the steps first.",
        "Add error notifications so a silent failure doesn't lose data for weeks.",
        "Watch free-tier task limits; high volume can need a paid plan.",
      ],
      worthItWhen: "You re-type the same data into 2+ tools regularly and mistakes slip through.",
      skipIf: "Your tools already integrate natively, or the volume is tiny — turn on the native integration instead.",
      metric: "Hours/week spent on manual data entry and error/rework rate, before vs. after.",
      timeToValue: "One connection live in a weekend; payback in saved hours within weeks.",
    },
  },

  reporting: {
    id: "reporting",
    name: "Monday-morning report",
    category: "Operations",
    problem: "You run on gut feel because pulling the numbers together is a chore you never get around to.",
    helps: [
      "Builds a short weekly summary of your key numbers itself",
      "Lands in your inbox every Monday, no effort",
      "Compares to last week so you spot trouble early",
    ],
    what: "A short summary of your key numbers — leads, bookings, revenue — builds itself and lands in your inbox every Monday.",
    why: "You make decisions on data instead of gut feeling, and you spot a bad week while you can still fix it.",
    effort: "project",
    difficulty: "weekend",
    impact: 6,
    setupTime: "A weekend to set up the first one",
    cost: "Free with a spreadsheet + automation",
    synergies: ["data"],
    tools: [
      { name: "Google Sheets", url: "https://sheets.google.com", tier: "free", note: "The data hub" },
      { name: "Make", url: "https://make.com", tier: "freemium", note: "Schedule the weekly send" },
    ],
    tiers: [
      { level: "Quick Win", time: "An hour", what: "Pick the 4 numbers you'd actually act on and track them in one simple spreadsheet weekly.", impact: "You start seeing trends instead of guessing." },
      { level: "Workflow Fix", time: "A weekend", what: "Automate a Monday email that pulls this week vs. last week from the sheet.", impact: "The report builds and sends itself — decisions on data, zero effort." },
      { level: "Built right", time: "2–3 weeks", what: "A live dashboard fed automatically from your tools, with AI commentary on what changed and why.", impact: "Always-on visibility with plain-English 'here's what to watch'." },
    ],
    playbook: {
      howItWorks:
        "Your data lands in one spreadsheet (ideally fed by the copy-paste connector). A scheduled automation reads the week's figures, compares them to last week, and emails you a tight summary every Monday — optionally with a one-line AI commentary on what changed.",
      stack: [
        { layer: "Data hub", tool: "Google Sheets", does: "Holds the weekly numbers in one place." },
        { layer: "Scheduler", tool: "Make / Apps Script", does: "Runs every Monday and assembles the summary." },
        { layer: "Optional brain", tool: "Claude / GPT", does: "Adds a plain-English 'what changed and why it matters' line." },
      ],
      phases: [
        { title: "Decide the 4 numbers", detail: "Pick the 4 metrics you'd actually act on (e.g. new leads, bookings, revenue, no-shows). Resist tracking everything." },
        { title: "Get them into one sheet", detail: "Manually at first, or auto-fed by the connector. One row per week." },
        { title: "Weekend — automate the send", detail: "Schedule the Monday email with this week vs. last week. Add the AI commentary once the basics work." },
      ],
      watchOuts: [
        "A 30-metric dashboard you never read is worse than 4 numbers you act on.",
        "Garbage in, garbage out — the report is only as good as the data feeding the sheet.",
      ],
      worthItWhen: "You're flying blind week to week and decisions feel like guesses.",
      skipIf: "You're a true solo operation with the numbers already in your head.",
      metric: "Whether you actually open and act on it — and decisions made from data vs. gut.",
      timeToValue: "First automated report next Monday after a weekend of setup.",
    },
  },

  quoting: {
    id: "quoting",
    name: "Fast quote / proposal drafts",
    category: "Sales & leads",
    problem: "Proposals eat hours you don't have, so they pile up — and the slow reply costs you the deal.",
    helps: [
      "Turns a short brief into a clean, on-brand draft in minutes",
      "You keep control of pricing; AI handles the words",
      "You send same-day while competitors are still typing",
    ],
    what: "Feed in the brief, get a clean, professional, on-brand proposal draft in minutes instead of hours — you just finalise and send.",
    why: "You send while competitors are still typing, and you stop dreading proposal-writing, so fewer leads sit waiting.",
    effort: "quickwin",
    difficulty: "diy",
    impact: 7,
    setupTime: "Start today once you have a template",
    cost: "Free tier works for most",
    synergies: ["content", "intake"],
    tools: [
      { name: "Claude", url: "https://claude.ai", tier: "freemium", note: "Turn a brief into a draft" },
      { name: "PandaDoc", url: "https://pandadoc.com", tier: "freemium", note: "Templated proposals + e-sign" },
    ],
    tiers: [
      { level: "Quick Win", time: "Today", what: "Turn your best past proposal into a template and use AI to fill it from a short brief for each lead.", impact: "Proposals go from hours to minutes — you send same-day." },
      { level: "Workflow Fix", time: "A few hours", what: "Add a quick intake form that feeds the brief straight into your draft, plus e-signature.", impact: "Brief → draft → signed with far less friction and faster wins." },
      { level: "Built right", time: "1–2 weeks", what: "Proposals generated from your CRM data with pricing logic and tracking on opens/signs.", impact: "A quoting machine that also tells you which proposals are landing." },
    ],
    playbook: {
      howItWorks:
        "You turn your best past proposal into a structured template and write a short, fill-in-the-blanks brief format. For each new lead you fill the brief (2 minutes), hand it to the AI with your template, and get a tailored draft. You adjust pricing and specifics, then send — often the same day.",
      stack: [
        { layer: "Template", tool: "Your best past proposal", does: "Defines structure, tone and standard sections." },
        { layer: "Brief", tool: "A short intake format", does: "Captures the few facts that make each quote unique." },
        { layer: "Drafting", tool: "Claude", does: "Merges brief + template into a finished-looking draft." },
        { layer: "Send", tool: "PandaDoc / email", does: "Pretty proposal + e-signature to close faster." },
      ],
      phases: [
        { title: "Today — build the template", detail: "Take your strongest proposal, strip the client-specific bits, mark the variables." },
        { title: "Define the brief", detail: "List the 5–8 facts you need to quote (scope, timeline, budget signal). Make it a quick form." },
        { title: "Run it live", detail: "Next lead: fill brief → AI draft → you set price + finalise → send same day." },
      ],
      watchOuts: [
        "Never let the AI set prices — you own pricing; it owns the words.",
        "Re-read every draft; a wrong scope line in a proposal is a costly mistake.",
        "Keep a human, specific opening paragraph so it doesn't read templated.",
      ],
      worthItWhen: "Proposals take you hours and that delay is costing you deals.",
      skipIf: "Your quotes are a single line/number — a template alone is faster than involving AI.",
      metric: "Hours per proposal and quote→win rate (faster sends usually win more).",
      timeToValue: "Today — your next proposal can go out in a fraction of the time.",
    },
  },

  reviews: {
    id: "reviews",
    name: "Review & referral asker",
    category: "Marketing",
    problem: "You do great work but forget to ask — so your reviews don't reflect how good you actually are.",
    helps: [
      "Fires a warm request at the perfect happy moment",
      "One-tap link removes all friction to leaving a review",
      "Runs on autopilot so you never forget to ask",
    ],
    what: "An automated, personal request for a review or referral fires at the perfect moment — right after a happy outcome.",
    why: "More reviews lift your local ranking and trust, which drives more inbound — and it all runs on autopilot at the moment people are happiest.",
    effort: "quickwin",
    difficulty: "diy",
    impact: 6,
    setupTime: "About an hour",
    cost: "Free to start",
    synergies: ["followup"],
    tools: [
      { name: "Make", url: "https://make.com", tier: "freemium", note: "Fire the request at the right moment" },
      { name: "Google Business", url: "https://business.google.com", tier: "free", note: "Where the review lands" },
    ],
    tiers: [
      { level: "Quick Win", time: "An hour", what: "Write one warm request message with a direct review link and send it manually after each happy job.", impact: "More reviews start landing because you finally, consistently ask." },
      { level: "Workflow Fix", time: "A few hours", what: "Automate the request to fire 1–2 days after a job is marked complete.", impact: "Reviews accumulate on autopilot at exactly the right moment." },
      { level: "Built right", time: "1–2 weeks", what: "Smart timing by job type, referral asks layered in, wired to your CRM with tracking.", impact: "A steady review + referral flywheel feeding your inbound." },
    ],
    playbook: {
      howItWorks:
        "You define the 'happy moment' (job marked complete, invoice paid, project delivered). When that event happens, an automation waits a day or two, then sends a warm message with a direct one-tap link to leave a review — removing every bit of friction between 'they're happy' and 'they've reviewed you'.",
      stack: [
        { layer: "Trigger", tool: "Job/CRM/invoice status", does: "Marks the happy moment that should prompt a request." },
        { layer: "Automation", tool: "Make", does: "Waits the right delay, then sends the request." },
        { layer: "Destination", tool: "Google Business link", does: "One tap to the review form." },
      ],
      phases: [
        { title: "Write one great message", detail: "Short, warm, names the specific job, includes the direct review link. No corporate tone." },
        { title: "Pick the trigger + delay", detail: "Choose the completion event and a 1–2 day delay so it lands while they're still pleased." },
        { title: "Automate + watch", detail: "Wire trigger → delay → send. Track review count weekly and tweak timing." },
      ],
      watchOuts: [
        "Asking too early (before value is felt) or too late (they've moved on) both kill response — timing is everything.",
        "Never incentivise reviews in ways that breach platform rules.",
        "Make the link go straight to the review box, not your homepage.",
      ],
      worthItWhen: "You do good work but forget to ask, so your review count doesn't reflect your quality.",
      skipIf: "You already have a strong, steady review flow and a habit of asking.",
      metric: "New reviews per month and the request→review conversion rate.",
      timeToValue: "About an hour to set up; new reviews within the first job cycle.",
    },
  },

  intake: {
    id: "intake",
    name: "Smart intake & qualification",
    category: "Sales & leads",
    problem: "Too many calls go nowhere because the person was never a real fit — draining your scarce time.",
    helps: [
      "Asks 3–4 sharp questions before anyone books",
      "Routes good-fit leads straight to your calendar",
      "Sends poor-fit ones a helpful off-ramp — you skip the call",
    ],
    what: "A few sharp questions sort serious buyers from browsers before they ever reach your calendar, routing only the right people to you.",
    why: "You spend your scarce live time only on people who can actually say yes, instead of burning calls on tyre-kickers.",
    effort: "project",
    difficulty: "weekend",
    impact: 7,
    setupTime: "A weekend to design + route",
    cost: "Free with a form + routing logic",
    synergies: ["leadreply", "scheduling", "quoting"],
    tools: [
      { name: "Tally", url: "https://tally.so", tier: "free", note: "Conditional qualifying questions" },
      { name: "Typeform", url: "https://typeform.com", tier: "freemium", note: "Polished intake flow" },
    ],
    tiers: [
      { level: "Quick Win", time: "An hour", what: "Add 3 qualifying questions to your contact/booking form so you can see fit before you reply.", impact: "You stop walking into calls blind about budget and fit." },
      { level: "Workflow Fix", time: "A weekend", what: "Add branching logic: good fits → booking page, poor fits → a helpful off-ramp email.", impact: "Only qualified people reach your calendar; dead-end calls drop." },
      { level: "Built right", time: "2–3 weeks", what: "Scored intake wired to your CRM that prioritises hot leads and routes by type.", impact: "Your live time goes only to the leads most likely to say yes." },
    ],
    playbook: {
      howItWorks:
        "Before anyone books, they answer 3–4 qualifying questions (budget range, timeline, scope fit). Conditional logic routes the answers: a good fit goes straight to your booking page; a poor fit gets a helpful 'here's a resource / we're not the right fit' response — so you never take the call at all.",
      stack: [
        { layer: "Form", tool: "Tally / Typeform", does: "Asks the qualifying questions with branching logic." },
        { layer: "Logic", tool: "Form conditions / Make", does: "Decides fit vs. not-fit from the answers." },
        { layer: "Routes", tool: "Cal.com + auto-email", does: "Sends fits to booking, others to a polite off-ramp." },
      ],
      phases: [
        { title: "Define 'a yes'", detail: "Write the 3 things that make someone a real buyer for you (budget, timeline, scope). These become the questions." },
        { title: "Build the branching form", detail: "Good answers → booking page. Poor answers → helpful redirect. Keep it to 4 questions max." },
        { title: "Weekend — wire the routing", detail: "Connect the form to your calendar and the off-ramp email. Test both paths end to end." },
      ],
      watchOuts: [
        "Over-qualifying scares off good leads — keep it short and frame questions as 'so I can help you best'.",
        "Have a graceful, generous off-ramp; today's 'no' can be next year's 'yes'.",
        "Don't ask exact budget bluntly — ranges feel less invasive and convert better.",
      ],
      worthItWhen: "A real share of your calls go nowhere because the person was never a fit.",
      skipIf: "Almost everyone who contacts you is a genuine prospect — friction would cost you more than it saves.",
      metric: "Share of booked calls that are qualified, and hours saved on dead-end calls.",
      timeToValue: "Built in a weekend; cleaner calendar within the first week.",
    },
  },

  notes: {
    id: "notes",
    name: "Call & meeting summariser",
    category: "Operations",
    problem: "You're scribbling during calls instead of listening, and follow-ups slip through the cracks afterwards.",
    helps: [
      "Turns messy notes or recordings into clean summaries",
      "Produces a clear next-step list every time",
      "Lets you be present in the call instead of writing",
    ],
    what: "Turns messy call notes or recordings into clean summaries and clear next-step lists — automatically, right after the call.",
    why: "Nothing important slips through the cracks, follow-ups actually happen, and you're present in the call instead of scribbling.",
    effort: "quickwin",
    difficulty: "diy",
    impact: 6,
    setupTime: "Start today",
    cost: "Free tiers exist; ~€10–18/mo for recording",
    synergies: ["followup"],
    tools: [
      { name: "Fireflies", url: "https://fireflies.ai", tier: "freemium", note: "Records + summarises calls" },
      { name: "Claude", url: "https://claude.ai", tier: "freemium", note: "Paste notes → clean summary" },
    ],
    tiers: [
      { level: "Quick Win", time: "Today", what: "After a call, paste your rough notes into AI with a fixed prompt to get a summary + next steps.", impact: "Clean write-ups in seconds; nothing forgotten after the call." },
      { level: "Workflow Fix", time: "An hour", what: "Add a notetaker that auto-records and summarises calls into your standard format.", impact: "You stay present in calls; summaries appear on their own." },
      { level: "Built right", time: "1–2 weeks", what: "Summaries auto-saved to your CRM with action items pushed into your follow-up/task system.", impact: "Every call turns into tracked next steps that actually get done." },
    ],
    playbook: {
      howItWorks:
        "Either a notetaker joins your calls and transcribes them, or you paste your rough notes into an AI with a fixed prompt ('summarise into: decisions, owner's actions, client's actions, follow-up date'). You get a consistent, skimmable summary every time and a next-step list you can actually act on.",
      stack: [
        { layer: "Capture", tool: "Fireflies (auto) or your notes", does: "Records/transcribes the call or holds your rough notes." },
        { layer: "Summariser", tool: "Claude / built-in AI", does: "Turns it into a fixed-format summary + actions." },
        { layer: "Home", tool: "CRM / Notion / email", does: "Where the summary lives so you'll actually see it." },
      ],
      phases: [
        { title: "Today — fix the format", detail: "Decide your summary template (decisions / my actions / their actions / next date) and save the prompt." },
        { title: "Run it after one call", detail: "Paste notes (or use the recorder), generate the summary, save it where follow-ups live." },
        { title: "Automate the handoff", detail: "Pipe action items into your follow-up sequence or task list so they don't die in a doc." },
      ],
      watchOuts: [
        "Get consent before auto-recording calls — it's a legal and trust issue in many places.",
        "Always skim the summary; AI can misattribute who owns an action.",
        "A summary nobody reads is wasted — route the actions somewhere you work from.",
      ],
      worthItWhen: "You take a lot of calls and details/follow-ups regularly slip after them.",
      skipIf: "You have few calls and your memory + a notepad already keep nothing slipping.",
      metric: "Follow-up completion rate and time spent writing up calls, before vs. after.",
      timeToValue: "Today — clean summary after your very next call.",
    },
  },

  socials: {
    id: "socials",
    name: "Social posting on autopilot",
    category: "Marketing",
    problem: "You mean to post, then go quiet for weeks — and the audience you built slowly forgets you.",
    helps: [
      "Schedules a week of posts across your channels at once",
      "Repurposes content you already have",
      "Keeps your feed alive even in weeks you don't open the apps",
    ],
    what: "A batch of posts gets scheduled across your channels for the week, repurposed from content you already have.",
    why: "You stay visible without living inside the apps every day, so the audience you've built doesn't go cold.",
    effort: "quickwin",
    difficulty: "diy",
    impact: 5,
    setupTime: "An hour to set up, then ~30 min/week",
    cost: "Free tier covers one brand",
    synergies: ["content", "reviews"],
    tools: [
      { name: "Buffer", url: "https://buffer.com", tier: "freemium", note: "Simple scheduling, free plan" },
      { name: "Postiz", url: "https://postiz.com", tier: "free", note: "Open-source, AI-assisted" },
    ],
    honestNote:
      "Scheduling itself isn't AI — pair a free scheduler with the Content engine and you've got the whole loop for free.",
    tiers: [
      { level: "Quick Win", time: "An hour", what: "Batch a week of posts (use the Content engine) and schedule them in a free tool.", impact: "Your feed stays active even on weeks you're heads-down." },
      { level: "Workflow Fix", time: "A few hours", what: "Add an evergreen queue that recycles your best posts on rotation.", impact: "Consistent presence with ~30 minutes of upkeep a week." },
      { level: "Built right", time: "1–2 weeks", what: "A content-to-schedule pipeline that repurposes long content into a full week across channels.", impact: "Always-on visibility from one input — no daily app-juggling." },
    ],
    playbook: {
      howItWorks:
        "Once a week you batch-create posts (ideally with the Content engine), drop them into a scheduler, and it publishes them to your chosen platforms at set times — so your feed stays alive even in weeks you don't open the apps.",
      stack: [
        { layer: "Create", tool: "Content engine (AI)", does: "Generates the week's posts from one idea." },
        { layer: "Schedule", tool: "Buffer / Postiz", does: "Queues and auto-publishes to each channel." },
        { layer: "Recycle", tool: "Evergreen queue", does: "Re-posts your best content on rotation." },
      ],
      phases: [
        { title: "Pick 1–2 channels", detail: "Only the platforms your customers actually use. Two done well beats five neglected." },
        { title: "Batch + schedule a week", detail: "Create 5 posts in one sitting, queue them across the week at sensible times." },
        { title: "Add an evergreen loop", detail: "Put your best-performing posts on a recycle queue so the feed never goes silent." },
      ],
      watchOuts: [
        "Scheduling dead content on a timer still bores people — the posts have to be worth reading.",
        "Don't fully auto-pilot replies/DMs; engagement is where the relationship happens.",
      ],
      worthItWhen: "You go quiet for weeks because posting in real time keeps falling off your plate.",
      skipIf: "Social isn't where your customers are — put the effort where they actually look.",
      metric: "Posting consistency (posts/week) and follower + reach trend over a couple of months.",
      timeToValue: "An hour to set up; a full scheduled week immediately.",
    },
  },

  support: {
    id: "support",
    name: "Support inbox triage",
    category: "Customer service",
    problem: "Support messages pile up faster than you can clear them, and the urgent ones get buried.",
    helps: [
      "Sorts, tags and prioritises incoming messages",
      "Drafts a suggested reply from your help docs",
      "You review and send in a fraction of the time",
    ],
    what: "Incoming messages get sorted, tagged and a draft reply suggested, so you clear the queue in a fraction of the time.",
    why: "Faster, more consistent answers without hiring a support person — and the urgent stuff surfaces first instead of getting buried.",
    effort: "project",
    difficulty: "weekend",
    impact: 6,
    setupTime: "A weekend to wire up + tune",
    cost: "Free tiers exist; ~€0–30/mo at volume",
    synergies: ["faq", "data"],
    tools: [
      { name: "Help Scout", url: "https://helpscout.com", tier: "freemium", note: "Shared inbox + AI drafts" },
      { name: "Make", url: "https://make.com", tier: "freemium", note: "Auto-tag and route" },
    ],
    honestNote:
      "If your volume is low, clear templates and saved replies may be all you need before adding AI.",
    tiers: [
      { level: "Quick Win", time: "An afternoon", what: "Build saved replies for your 5 most common message types.", impact: "Most of the repetitive answering time disappears — no AI needed yet." },
      { level: "Workflow Fix", time: "A weekend", what: "Add auto-tagging/prioritisation and AI-suggested replies you approve before sending.", impact: "Clear the queue faster with the urgent stuff surfaced first." },
      { level: "Built right", time: "2–4 weeks", what: "A triage system wired to your help docs and product, with routing and analytics.", impact: "Support scales with volume without adding a hire." },
    ],
    playbook: {
      howItWorks:
        "Incoming support messages flow into a shared inbox. An automation classifies each one (billing, how-to, bug, urgent), tags and prioritises it, and an AI drafts a suggested reply from your help docs. You review and send with one click — you stay in control, but the heavy lifting is done.",
      stack: [
        { layer: "Inbox", tool: "Help Scout", does: "One shared place for all support messages." },
        { layer: "Triage", tool: "Make + AI", does: "Classifies, tags and prioritises each message." },
        { layer: "Draft", tool: "AI on your docs", does: "Pre-writes a reply for you to approve." },
      ],
      phases: [
        { title: "List the 5 message types", detail: "Identify the categories you get most, and the standard answer to each." },
        { title: "Templates first", detail: "Build saved replies for those 5 — this alone cuts most of the time, no AI needed yet." },
        { title: "Weekend — add AI drafts", detail: "Layer auto-tagging and AI-suggested replies on top, reviewing every draft before sending." },
      ],
      watchOuts: [
        "Never auto-send AI replies on sensitive or billing issues — keep a human approving.",
        "Bad/outdated help docs produce bad drafts; fix the source first.",
        "Watch tone on frustrated customers — that's where a templated feel backfires hardest.",
      ],
      worthItWhen: "Support volume is growing faster than you can keep up, but not enough to justify a hire.",
      skipIf: "You get a handful of messages a day — saved replies are simpler and enough.",
      metric: "Median first-response time and number of tickets handled per hour.",
      timeToValue: "Templates help immediately; AI drafts add up over a weekend's setup.",
    },
  },

  onboarding: {
    id: "onboarding",
    name: "Client onboarding flow",
    category: "Operations",
    problem: "Every new client is a scramble of manual steps, and the experience comes out different each time.",
    helps: [
      "Fires welcome, forms, contract and first task in order",
      "Every client gets the same polished start",
      "You stop forgetting steps and look bigger than you are",
    ],
    what: "A new client triggers welcome emails, intake forms, contracts and the first task — all in the right order, automatically.",
    why: "Every client gets the same polished, professional start, you stop forgetting steps, and you look bigger than you are.",
    effort: "project",
    difficulty: "weekend",
    impact: 6,
    setupTime: "A weekend to map + build once",
    cost: "Free with forms + automation; tools ~€0–29/mo",
    synergies: ["intake", "invoicing", "data"],
    tools: [
      { name: "Make", url: "https://make.com", tier: "freemium", note: "Orchestrate the sequence" },
      { name: "Tally", url: "https://tally.so", tier: "free", note: "Intake + contract forms" },
    ],
    tiers: [
      { level: "Quick Win", time: "An afternoon", what: "Write a checklist + one welcome email and one intake form you reuse for every client.", impact: "Onboarding stops being a scramble; nothing obvious gets missed." },
      { level: "Workflow Fix", time: "A weekend", what: "Automate the sequence: signed deal → welcome → form → contract → first task.", impact: "Every client gets the same polished start, hands-off." },
      { level: "Built right", time: "2–4 weeks", what: "A full onboarding engine wired to payments/CRM with stall-detection nudges.", impact: "A consistent, professional first experience that scales with you." },
    ],
    playbook: {
      howItWorks:
        "You map every step a new client currently goes through, then build it once as an automated sequence: a signed deal triggers the welcome email, the intake form, the contract, the invoice and the first task — each firing in order, on time, without you remembering to do them.",
      stack: [
        { layer: "Trigger", tool: "Deal won / payment", does: "Kicks off the onboarding sequence." },
        { layer: "Orchestrator", tool: "Make", does: "Runs each step in the right order with the right delays." },
        { layer: "Pieces", tool: "Tally + email + e-sign + invoice", does: "Forms, welcome, contract, first invoice." },
      ],
      phases: [
        { title: "Map the current steps", detail: "Write down literally everything a new client experiences today, in order. Find the gaps." },
        { title: "Standardise the pieces", detail: "One welcome email, one intake form, one contract template, one first-task brief." },
        { title: "Weekend — automate the chain", detail: "Wire trigger → welcome → form → contract → invoice → first task. Test with a dummy client." },
      ],
      watchOuts: [
        "Keep a human touch (a personal welcome note) so it doesn't feel like a faceless machine.",
        "Don't over-automate before your process is actually settled — you'll rebuild it constantly.",
        "Build in a check so a stalled step (e.g. unsigned contract) nudges someone instead of silently halting.",
      ],
      worthItWhen: "Each new client is a scramble and the experience is inconsistent from one to the next.",
      skipIf: "You take very few clients and your onboarding is already smooth and personal.",
      metric: "Time from 'yes' to 'first task done', and onboarding steps missed per client.",
      timeToValue: "A weekend to build; every client after that gets the polished version.",
    },
  },
};
