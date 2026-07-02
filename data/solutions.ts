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

  // ================= Industry-specific case studies =================

  re_listing: {
    id: "re_listing",
    name: "Listing description writer",
    category: "Marketing",
    problem: "Every new property needs fresh, sellable copy — and writing it well, fast, for every portal eats your day.",
    helps: [
      "Turns the property facts into polished listing copy in your voice",
      "Spins out portal, email and social versions at once",
      "Keeps tone consistent across every listing",
    ],
    what: "Feed in the property's key details and get a polished listing description — plus matching social and email versions — in your voice, in a minute.",
    why: "Better-written listings get more clicks and enquiries, and you stop losing evenings to copywriting for every new instruction.",
    effort: "quickwin",
    difficulty: "diy",
    impact: 6,
    setupTime: "Start today",
    cost: "Free tier works",
    synergies: ["socials", "content", "re_matchalert"],
    tools: [
      { name: "Claude", url: "https://claude.ai", tier: "freemium", note: "Facts → on-brand listing copy" },
      { name: "ChatGPT", url: "https://chat.openai.com", tier: "freemium", note: "Fast variations" },
    ],
    tiers: [
      { level: "Quick Win", time: "Today", what: "Build a prompt with your tone + a fill-in property template; paste details, get a draft, edit lightly.", impact: "Listing copy in a minute instead of half an hour." },
      { level: "Workflow Fix", time: "A few hours", what: "Connect your CRM/listing form so details flow in and drafts come back automatically.", impact: "Every new listing gets copy the moment it's entered." },
      { level: "Built right", time: "1–2 weeks", what: "Auto-generate portal + social + email variants and queue them to publish.", impact: "One entry → copy live across every channel, hands-off." },
    ],
    playbook: {
      howItWorks:
        "You give an AI model your tone and a template that lists the facts that matter (beds, features, area highlights, price). For each property you paste the facts, and it returns a clean description you tweak — never inventing details it wasn't given.",
      stack: [
        { layer: "Template", tool: "A saved prompt", does: "Locks your tone and the fields to fill." },
        { layer: "Drafting", tool: "Claude / ChatGPT", does: "Turns facts into listing copy + variants." },
        { layer: "Publish", tool: "Your CRM/portal", does: "Where the copy goes live." },
      ],
      phases: [
        { title: "Today — the template", detail: "Write your tone rules and the facts you always include; save it as a reusable prompt." },
        { title: "Run it live", detail: "Next listing: paste the facts, generate, edit for accuracy, publish." },
        { title: "Level up", detail: "Auto-feed details from your CRM and generate the social/email versions too." },
      ],
      watchOuts: [
        "Only give it real facts — never let it invent square footage, schools or amenities.",
        "Check compliance/fair-housing wording; keep a human final read.",
      ],
      worthItWhen: "You list often and writing copy for each one is a real time sink.",
      skipIf: "You list rarely — a good template alone is enough.",
      metric: "Time per listing and click/enquiry rate on new listings.",
      timeToValue: "Today — your next listing can be drafted in a minute.",
    },
  },

  re_matchalert: {
    id: "re_matchalert",
    name: "Buyer match alerts",
    category: "Sales & leads",
    problem: "The right buyers hear about a new listing too late — after it's been on the portals for days.",
    helps: [
      "Matches each new listing to buyers on your list by their criteria",
      "Fires a personal alert the moment it lands",
      "Makes you first to the right buyer, automatically",
    ],
    what: "When a new listing goes live, matching buyers on your list get an instant, personal heads-up before it hits the portals.",
    why: "Speed and relevance win deals. This makes your database an asset instead of a spreadsheet you never use.",
    effort: "project",
    difficulty: "weekend",
    impact: 7,
    setupTime: "A weekend to wire up",
    cost: "Free tiers cover low volume",
    synergies: ["leadreply", "followup", "re_listing"],
    tools: [
      { name: "Make", url: "https://make.com", tier: "freemium", note: "Match listing → buyers, send alert" },
      { name: "Google Sheets", url: "https://sheets.google.com", tier: "free", note: "Buyer criteria list" },
    ],
    tiers: [
      { level: "Quick Win", time: "An hour", what: "Keep buyers + their criteria in one sheet and send manual matches when a listing lands.", impact: "The right buyers finally hear first." },
      { level: "Workflow Fix", time: "A weekend", what: "Automate: new listing → filter buyers by criteria → send each a personal alert.", impact: "Instant matched alerts with zero manual effort." },
      { level: "Built right", time: "2–3 weeks", what: "Wire it to your CRM with smart matching and reply tracking.", impact: "Your database quietly generates viewings on its own." },
    ],
    playbook: {
      howItWorks:
        "You store buyers with their must-haves (area, budget, beds). When a listing is added, an automation checks it against every buyer's criteria and messages the matches with the details and a viewing link — before the portal crowd sees it.",
      stack: [
        { layer: "Buyer list", tool: "Sheet / CRM", does: "Holds each buyer's criteria." },
        { layer: "Matcher", tool: "Make", does: "Filters buyers against the new listing." },
        { layer: "Alert", tool: "Email / SMS", does: "Sends the personal heads-up + viewing link." },
      ],
      phases: [
        { title: "Capture criteria", detail: "Add the must-haves for each active buyer to one place." },
        { title: "Build the match rule", detail: "New listing → filter by area/budget/beds → message matches." },
        { title: "Weekend — automate + test", detail: "Wire trigger to alert and test with a real listing." },
      ],
      watchOuts: [
        "Keep criteria current or you'll send irrelevant alerts and annoy buyers.",
        "Don't over-message — one good match beats ten loose ones.",
      ],
      worthItWhen: "You have a real buyer list and listings move fast.",
      skipIf: "Your buyer list is tiny — a quick manual text is easier.",
      metric: "Time-to-first-viewing on new listings and alert→viewing rate.",
      timeToValue: "Built in a weekend; matched viewings within the first listings.",
    },
  },

  tr_report: {
    id: "tr_report",
    name: "Job photo → progress report",
    category: "Operations",
    problem: "You snap site photos all day, but turning them into a tidy client update never happens — so clients feel left in the dark.",
    helps: [
      "Turns photos + a few notes into a clean progress update",
      "Sends clients a professional report without the evening admin",
      "Keeps a tidy record of every job stage",
    ],
    what: "Drop in your site photos and a line of notes, and get a clean, client-ready progress update — without sitting down to write it up.",
    why: "Clients who get clear updates chase you less, trust you more, and refer you — and you skip the paperwork.",
    effort: "quickwin",
    difficulty: "diy",
    impact: 6,
    setupTime: "Start today",
    cost: "Free to start",
    synergies: ["notes", "reviews", "invoicing"],
    tools: [
      { name: "Claude", url: "https://claude.ai", tier: "freemium", note: "Notes → tidy update" },
      { name: "Google Docs", url: "https://docs.google.com", tier: "free", note: "Hold the report" },
    ],
    tiers: [
      { level: "Quick Win", time: "Today", what: "After a site visit, paste your rough notes + attach photos into a fixed report template.", impact: "A professional update in minutes, not skipped entirely." },
      { level: "Workflow Fix", time: "A few hours", what: "Standardise a per-stage template and send it to clients on a set cadence.", impact: "Clients get consistent updates without you remembering." },
      { level: "Built right", time: "1–2 weeks", what: "Photos uploaded from your phone auto-assemble into a branded report and send.", impact: "Updates happen from the site with no desk time." },
    ],
    playbook: {
      howItWorks:
        "You keep a simple report structure (what got done, what's next, any decisions needed). You paste your quick notes, an AI tidies them into clear client language, you attach the photos and send. No blank-page write-up at the end of the day.",
      stack: [
        { layer: "Capture", tool: "Phone photos + notes", does: "The raw material from site." },
        { layer: "Writer", tool: "Claude", does: "Turns notes into a clear update." },
        { layer: "Send", tool: "Email / Docs", does: "Delivers the report to the client." },
      ],
      phases: [
        { title: "Today — the template", detail: "Decide your report sections and save a prompt that fills them from notes." },
        { title: "Run it after one job", detail: "Paste notes, attach photos, send. See how it lands." },
        { title: "Automate", detail: "Wire phone uploads to auto-build and send on a schedule." },
      ],
      watchOuts: [
        "Keep it factual — don't let it over-promise timelines you haven't agreed.",
        "A quick human glance before sending avoids embarrassing errors.",
      ],
      worthItWhen: "Clients want updates and writing them up keeps slipping.",
      skipIf: "Your jobs are quick one-visit fixes that don't need updates.",
      metric: "Client chase-up messages (should fall) and referral/repeat rate.",
      timeToValue: "Today — your next job update takes minutes.",
    },
  },

  tr_estimate: {
    id: "tr_estimate",
    name: "Instant estimate builder",
    category: "Sales & leads",
    problem: "Every estimate is built from scratch, so quoting is slow — and the slow quote often loses the job.",
    helps: [
      "Builds a ballpark estimate from your own rates and materials",
      "Turns a short brief into a clean, itemised draft",
      "Gets a number to the customer fast, while they're still keen",
    ],
    what: "Feed in the job details and your price list, and get a clean, itemised estimate draft in minutes — you review the numbers and send.",
    why: "The first fair quote often wins. This gets you there fast without you owning the maths from zero each time.",
    effort: "quickwin",
    difficulty: "diy",
    impact: 7,
    setupTime: "Start today once your rates are listed",
    cost: "Free tier works",
    synergies: ["quoting", "leadreply", "tr_report"],
    tools: [
      { name: "Google Sheets", url: "https://sheets.google.com", tier: "free", note: "Your rate/price book" },
      { name: "Claude", url: "https://claude.ai", tier: "freemium", note: "Brief + rates → itemised draft" },
    ],
    tiers: [
      { level: "Quick Win", time: "Today", what: "Put your rates in a sheet; paste a job brief + the relevant rates and get an itemised draft.", impact: "Estimates out same-day instead of 'I'll get back to you'." },
      { level: "Workflow Fix", time: "A few hours", what: "Build a quick intake form that feeds the brief straight into the estimate.", impact: "Enquiry → itemised draft with far less back-and-forth." },
      { level: "Built right", time: "1–2 weeks", what: "Estimates generated from your live price book with margins and a send/e-sign step.", impact: "A quoting machine priced from your real numbers." },
    ],
    playbook: {
      howItWorks:
        "You keep your labour and material rates in one place. For a new job you give the AI the scope plus the relevant rates, and it lays out an itemised estimate. You set/confirm the final prices — it never guesses your rates, it uses the ones you provide.",
      stack: [
        { layer: "Price book", tool: "Google Sheets", does: "Your real labour + material rates." },
        { layer: "Drafting", tool: "Claude", does: "Turns scope + rates into an itemised estimate." },
        { layer: "Send", tool: "Email / invoicing tool", does: "Deliver the quote to the customer." },
      ],
      phases: [
        { title: "List your rates", detail: "Get labour + common materials into one sheet you can copy from." },
        { title: "Draft one estimate", detail: "Paste scope + rates, generate, sanity-check the maths, send." },
        { title: "Streamline", detail: "Add an intake form and, later, generate straight from the price book." },
      ],
      watchOuts: [
        "You own pricing — always verify totals and margins before sending.",
        "Keep the price book current or estimates drift from reality.",
      ],
      worthItWhen: "Quoting is slow and that delay costs you jobs.",
      skipIf: "Your jobs are fixed-price and a template already covers it.",
      metric: "Time-to-quote and quote→win rate.",
      timeToValue: "Today — your next estimate goes out same-day.",
    },
  },

  pr_docsum: {
    id: "pr_docsum",
    name: "Document & contract summariser",
    category: "Operations",
    problem: "Long documents and contracts eat hours as you hunt for the key points, obligations and risks.",
    helps: [
      "Summarises long docs into key points, dates and obligations",
      "Flags the clauses and risks worth a closer look",
      "Turns a 30-page read into a 2-minute brief",
    ],
    what: "Drop in a long document and get a structured summary — key terms, obligations, dates and anything that needs a human's eye.",
    why: "You reclaim billable hours and brief clients faster, without skimming and missing something important.",
    effort: "quickwin",
    difficulty: "diy",
    impact: 7,
    setupTime: "Start today",
    cost: "Free tiers exist; ~€18/mo for heavy use",
    synergies: ["notes", "faq", "pr_deadlines"],
    tools: [
      { name: "Claude", url: "https://claude.ai", tier: "freemium", note: "Strong at long-doc summaries" },
      { name: "ChatGPT", url: "https://chat.openai.com", tier: "freemium", note: "Alternative" },
    ],
    honestNote:
      "AI summaries are a starting point, not legal advice — a professional must still review anything that matters.",
    tiers: [
      { level: "Quick Win", time: "Today", what: "Paste a document with a fixed prompt: key terms, obligations, dates, risks, questions.", impact: "A 2-minute brief instead of a 30-minute read." },
      { level: "Workflow Fix", time: "A few hours", what: "Standardise summary formats per document type and save them to the client file.", impact: "Consistent briefs your whole team can rely on." },
      { level: "Built right", time: "2–4 weeks", what: "A private assistant over your document store with strict review controls.", impact: "Fast, consistent review at scale — with a human in the loop." },
    ],
    playbook: {
      howItWorks:
        "You paste (or upload) the document with a fixed instruction to extract a set structure — parties, key terms, obligations, dates, and anything unusual to check. It returns a skimmable brief so you spend your time on judgement, not hunting.",
      stack: [
        { layer: "Input", tool: "The document", does: "What you need summarised." },
        { layer: "Summariser", tool: "Claude", does: "Extracts the fixed structure + flags risks." },
        { layer: "Home", tool: "Client file / CRM", does: "Where the brief is stored." },
      ],
      phases: [
        { title: "Today — fix the format", detail: "Write the extraction prompt (terms/obligations/dates/risks). Save it." },
        { title: "Run it on a real doc", detail: "Summarise, then verify against the source before relying on it." },
        { title: "Handle sensitive data properly", detail: "For confidential files, use a tool/plan with the right data terms." },
      ],
      watchOuts: [
        "Never rely on the summary alone for anything that carries risk — verify against the source.",
        "Mind confidentiality: use an appropriate, private tool for sensitive documents.",
      ],
      worthItWhen: "You read a lot of long documents and it's eating billable time.",
      skipIf: "Your documents are short or highly bespoke where full reading is unavoidable.",
      metric: "Time per document review and turnaround to the client.",
      timeToValue: "Today — your next long doc summarised in minutes.",
    },
  },

  pr_deadlines: {
    id: "pr_deadlines",
    name: "Deadline & filing tracker",
    category: "Admin & finance",
    problem: "Client deadlines, filings and renewals are scattered — and a missed date is a genuinely costly problem.",
    helps: [
      "Keeps every client deadline in one place",
      "Sends you (and the client) reminders well ahead of time",
      "Turns 'I hope we didn't miss anything' into certainty",
    ],
    what: "Every client deadline — filings, renewals, reviews — lives in one tracker that reminds you and the client well before the date.",
    why: "You stop carrying deadlines in your head, protect against costly misses, and look on top of things.",
    effort: "quickwin",
    difficulty: "diy",
    impact: 6,
    setupTime: "About an hour",
    cost: "Free with a spreadsheet + automation",
    synergies: ["followup", "reporting", "pr_docsum"],
    tools: [
      { name: "Google Sheets", url: "https://sheets.google.com", tier: "free", note: "The deadline list" },
      { name: "Make", url: "https://make.com", tier: "freemium", note: "Fire reminders ahead of dates" },
    ],
    honestNote:
      "This isn't really AI — it's a shared tracker plus scheduled reminders. Set it up before paying for anything fancier.",
    notReallyAI: true,
    tiers: [
      { level: "Quick Win", time: "An hour", what: "Put every client deadline in one sheet with the date and owner.", impact: "Nothing lives only in your head anymore." },
      { level: "Workflow Fix", time: "A few hours", what: "Automate reminders to you (and the client) X days before each date.", impact: "You're nudged in time, every time — automatically." },
      { level: "Built right", time: "1–2 weeks", what: "Wire it to your practice tools with escalations if a task isn't done.", impact: "A safety net that catches slips before they become misses." },
    ],
    playbook: {
      howItWorks:
        "All client deadlines go into one dated list. A scheduled automation checks it daily and sends reminders a set number of days before each due date — to you, and optionally the client — so nothing sneaks up.",
      stack: [
        { layer: "Tracker", tool: "Google Sheets", does: "One dated list of every deadline." },
        { layer: "Scheduler", tool: "Make / Apps Script", does: "Checks daily, sends reminders ahead of time." },
      ],
      phases: [
        { title: "Build the list", detail: "One row per client deadline: what, when, who owns it." },
        { title: "Add reminders", detail: "Automate a nudge 14/7/1 days before each date." },
        { title: "Add escalation", detail: "If a deadline task isn't marked done, escalate it to you." },
      ],
      watchOuts: [
        "The tracker is only as good as the data — keep it current.",
        "Give each deadline a clear owner so reminders reach the right person.",
      ],
      worthItWhen: "You juggle many client deadlines and a miss is expensive.",
      skipIf: "You have very few clients and your calendar already covers it.",
      metric: "Missed/near-miss deadlines (aim for zero) and time spent tracking.",
      timeToValue: "An hour to set up; reminders start on the next cycle.",
    },
  },

  ec_cart: {
    id: "ec_cart",
    name: "Abandoned-cart recovery",
    category: "Sales & leads",
    problem: "Shoppers add to cart, then vanish — leaving ready-to-buy revenue on the table every day.",
    helps: [
      "Emails/texts shoppers who left items behind",
      "Nudges them back with a timely, friendly reminder",
      "Recovers sales you were otherwise losing",
    ],
    what: "When a shopper abandons their cart, an automated, well-timed email/SMS brings them back to finish the purchase.",
    why: "These are your warmest buyers — they nearly bought. Recovering even a slice of them is close to free revenue.",
    effort: "quickwin",
    difficulty: "diy",
    impact: 7,
    setupTime: "About an hour on most platforms",
    cost: "Free/low on most store platforms",
    synergies: ["followup", "reviews", "ec_productdesc"],
    tools: [
      { name: "Shopify Email", url: "https://www.shopify.com/email", tier: "freemium", note: "Built-in cart recovery" },
      { name: "Klaviyo", url: "https://www.klaviyo.com", tier: "freemium", note: "Powerful flows, free tier" },
    ],
    honestNote:
      "Most store platforms include cart recovery — switch it on before buying a separate tool.",
    tiers: [
      { level: "Quick Win", time: "An hour", what: "Turn on your platform's built-in abandoned-cart email with one friendly reminder.", impact: "You start recovering carts you were losing entirely." },
      { level: "Workflow Fix", time: "A few hours", what: "Add a 2–3 step flow (reminder → helpful nudge → gentle incentive) across email + SMS.", impact: "More recovered sales from the same traffic." },
      { level: "Built right", time: "1–2 weeks", what: "Personalise by product/segment and add browse-abandon + post-purchase flows.", impact: "A full lifecycle engine driving repeat revenue." },
    ],
    playbook: {
      howItWorks:
        "Your store already knows who abandoned a cart and what was in it. A flow waits a short while, then emails (or texts) the shopper a friendly reminder with their items and a one-tap link back to checkout — stopping if they complete the purchase.",
      stack: [
        { layer: "Store", tool: "Shopify / your platform", does: "Detects the abandoned cart + items." },
        { layer: "Flow", tool: "Shopify Email / Klaviyo", does: "Sends the timed recovery messages." },
      ],
      phases: [
        { title: "Turn on one reminder", detail: "Enable the built-in cart email with your branding and a clear CTA." },
        { title: "Add a short sequence", detail: "Reminder → helpful nudge → optional small incentive; exit on purchase." },
        { title: "Personalise", detail: "Segment by product/value and add browse-abandon + win-back flows." },
      ],
      watchOuts: [
        "Don't lead with a discount — you'll train shoppers to abandon on purpose.",
        "Keep timing tight; a reminder a day late converts far worse.",
      ],
      worthItWhen: "You get real cart traffic and see meaningful abandonment.",
      skipIf: "Volume is tiny — focus on getting traffic first.",
      metric: "Cart-recovery rate and revenue recovered per month.",
      timeToValue: "An hour to switch on; recovers carts the same day.",
    },
  },

  ec_productdesc: {
    id: "ec_productdesc",
    name: "Product description generator",
    category: "Marketing",
    problem: "Hundreds of SKUs need good, search-friendly descriptions — and writing them by hand never gets done.",
    helps: [
      "Turns specs into clear, on-brand, search-friendly copy",
      "Handles bulk catalogues, not one product at a time",
      "Keeps tone and format consistent across the store",
    ],
    what: "Feed in product specs and get clean, on-brand, SEO-friendly descriptions — in bulk — so your whole catalogue reads well.",
    why: "Better descriptions help products get found and bought, and you stop leaving SKUs with thin or missing copy.",
    effort: "quickwin",
    difficulty: "diy",
    impact: 6,
    setupTime: "Start today; bulk in a weekend",
    cost: "Free tier for small runs; ~€18/mo for bulk",
    synergies: ["content", "ec_cart", "socials"],
    tools: [
      { name: "Claude", url: "https://claude.ai", tier: "freemium", note: "Specs → on-brand copy" },
      { name: "Google Sheets", url: "https://sheets.google.com", tier: "free", note: "Bulk in/out" },
    ],
    tiers: [
      { level: "Quick Win", time: "Today", what: "Build a prompt with your tone + format; paste a product's specs, get a description.", impact: "Thin/missing descriptions filled in fast." },
      { level: "Workflow Fix", time: "A weekend", what: "Run the catalogue in batches from a spreadsheet (specs in → copy out).", impact: "A whole category described in a sitting." },
      { level: "Built right", time: "1–2 weeks", what: "Auto-generate copy for new SKUs as they're added, pushed to the store.", impact: "Every new product ships with good copy, automatically." },
    ],
    playbook: {
      howItWorks:
        "You define your tone and description format once. Then you feed products' real specs — individually or in bulk from a sheet — and get consistent, benefit-led descriptions back. It writes from the specs you give, so it won't invent features.",
      stack: [
        { layer: "Template", tool: "A saved prompt", does: "Your tone, structure and keyword rules." },
        { layer: "Drafting", tool: "Claude", does: "Specs → descriptions, in bulk." },
        { layer: "Store", tool: "Shopify / your platform", does: "Where the copy is published." },
      ],
      phases: [
        { title: "Today — the template", detail: "Lock tone, length, and the fields (features → benefits, keywords)." },
        { title: "Batch a category", detail: "Put specs in a sheet, generate copy for the whole set, review, upload." },
        { title: "Automate new SKUs", detail: "Trigger generation when a product is added and push to the store." },
      ],
      watchOuts: [
        "Feed real specs only — never let it invent materials, sizes or claims.",
        "Skim for accuracy and brand fit before publishing at scale.",
      ],
      worthItWhen: "You have many products and copy is thin, missing, or inconsistent.",
      skipIf: "You sell a handful of products you can describe by hand.",
      metric: "SKUs with quality copy and product-page conversion/search traffic.",
      timeToValue: "Today for a few; a whole category over a weekend.",
    },
  },

  ag_report: {
    id: "ag_report",
    name: "Client reporting packs",
    category: "Operations",
    problem: "Monthly client reporting swallows a whole day of copy-pasting numbers and writing the same commentary.",
    helps: [
      "Pulls the numbers together into a clean report",
      "Drafts the 'what happened and why' commentary",
      "Gives every client a consistent, on-time pack",
    ],
    what: "Your client metrics get pulled into a clean report with a first draft of the commentary — so reporting is review-and-send, not build-from-scratch.",
    why: "You win back a day a month and clients get sharper, more consistent reporting — which helps retention.",
    effort: "project",
    difficulty: "weekend",
    impact: 7,
    setupTime: "A weekend to set up the first one",
    cost: "Free tiers cover it; tools ~€0–20/mo",
    synergies: ["reporting", "data", "ag_scope"],
    tools: [
      { name: "Looker Studio", url: "https://lookerstudio.google.com", tier: "free", note: "Auto dashboards" },
      { name: "Make", url: "https://make.com", tier: "freemium", note: "Pull data + assemble" },
    ],
    tiers: [
      { level: "Quick Win", time: "A few hours", what: "Build one templated report and use AI to draft the commentary from the numbers.", impact: "Reporting time drops from a day to a couple of hours." },
      { level: "Workflow Fix", time: "A weekend", what: "Auto-pull metrics into a dashboard and generate the commentary on a schedule.", impact: "Reports mostly build themselves each month." },
      { level: "Built right", time: "2–4 weeks", what: "Per-client branded packs assembled and delivered automatically with AI insights.", impact: "Scale clients without scaling reporting hours." },
    ],
    playbook: {
      howItWorks:
        "Client metrics land in a dashboard or sheet. A template pulls the figures, and an AI drafts the plain-English 'what changed and why it matters' from those numbers. You edit the insight and send — no more manual copy-paste marathons.",
      stack: [
        { layer: "Data", tool: "Looker Studio / Sheets", does: "Collects the client's metrics." },
        { layer: "Assembler", tool: "Make", does: "Builds the report on schedule." },
        { layer: "Commentary", tool: "Claude", does: "Drafts the insight from the numbers." },
      ],
      phases: [
        { title: "Template one client", detail: "Decide the metrics and layout; get them into a dashboard." },
        { title: "Draft the commentary", detail: "Feed the numbers to AI for a first-pass insight; you refine it." },
        { title: "Weekend — automate", detail: "Schedule the pull + assembly + draft for every client." },
      ],
      watchOuts: [
        "AI can misread a number's cause — you own the insight, verify it.",
        "Garbage in, garbage out — the data feed has to be reliable.",
      ],
      worthItWhen: "You report to several clients monthly and it eats real time.",
      skipIf: "You have one or two clients and a quick manual report is fine.",
      metric: "Hours per reporting cycle and client retention.",
      timeToValue: "First templated report this month; automated after a weekend.",
    },
  },

  ag_scope: {
    id: "ag_scope",
    name: "Scope / SOW drafts",
    category: "Sales & leads",
    problem: "Turning a discovery call or brief into a scope of work takes hours — and slow scoping stalls deals.",
    helps: [
      "Turns notes/brief into a structured scope draft",
      "Includes deliverables, timeline and assumptions",
      "Gets a professional SOW in front of the client fast",
    ],
    what: "Feed in your call notes or brief and get a structured scope-of-work draft — deliverables, phases, timeline, assumptions — ready for you to price and send.",
    why: "Faster, clearer scoping closes deals quicker and prevents the scope-creep that kills project margins.",
    effort: "quickwin",
    difficulty: "diy",
    impact: 6,
    setupTime: "Today once you have a template",
    cost: "Free tier works",
    synergies: ["quoting", "notes", "onboarding"],
    tools: [
      { name: "Claude", url: "https://claude.ai", tier: "freemium", note: "Brief → structured SOW" },
      { name: "PandaDoc", url: "https://pandadoc.com", tier: "freemium", note: "Templated SOW + e-sign" },
    ],
    tiers: [
      { level: "Quick Win", time: "Today", what: "Turn your best SOW into a template; feed notes/brief and get a tailored draft.", impact: "Scopes drafted in minutes, sent same-day." },
      { level: "Workflow Fix", time: "A few hours", what: "Standardise deliverable/phase language and pipe it into an e-sign doc.", impact: "Brief → signed SOW with less friction and fewer gaps." },
      { level: "Built right", time: "1–2 weeks", what: "Generate scopes from your CRM/discovery data with pricing logic and tracking.", impact: "Consistent, margin-safe scoping at scale." },
    ],
    playbook: {
      howItWorks:
        "You keep a strong SOW template (structure, standard clauses, assumptions). For a new project you give the AI your discovery notes, and it drafts a tailored scope in that structure. You set pricing and tighten the deliverables before it goes out.",
      stack: [
        { layer: "Template", tool: "Your best SOW", does: "Structure, clauses, assumptions." },
        { layer: "Drafting", tool: "Claude", does: "Notes → tailored scope draft." },
        { layer: "Send", tool: "PandaDoc", does: "Pretty SOW + e-signature." },
      ],
      phases: [
        { title: "Today — template it", detail: "Take your best SOW, mark the variable parts and standard assumptions." },
        { title: "Draft from notes", detail: "Feed discovery notes, generate, then price and tighten scope." },
        { title: "Streamline", detail: "Pipe drafts into an e-sign template and track opens/signs." },
      ],
      watchOuts: [
        "Always nail down assumptions and exclusions — that's what prevents scope creep.",
        "You own pricing and commitments; review every draft before sending.",
      ],
      worthItWhen: "Scoping is slow and it's delaying or losing you projects.",
      skipIf: "Your projects are near-identical and one fixed template already works.",
      metric: "Time-to-proposal and scope-creep incidents per project.",
      timeToValue: "Today — your next scope goes out same-day.",
    },
  },

  he_reminders: {
    id: "he_reminders",
    name: "No-show reminders & rebooking",
    category: "Operations",
    problem: "No-shows leave gaps you can't fill in time — and empty chairs are lost revenue you never get back.",
    helps: [
      "Sends automatic appointment reminders by SMS/email",
      "Prompts easy rescheduling instead of a silent no-show",
      "Fills freed slots by nudging your waitlist",
    ],
    what: "Clients get automatic reminders before their appointment, an easy way to reschedule, and — when a slot frees up — your waitlist gets nudged to fill it.",
    why: "Fewer no-shows and faster re-fills directly protect your daily revenue, on autopilot.",
    effort: "quickwin",
    difficulty: "diy",
    impact: 8,
    setupTime: "About 30 minutes in your booking tool",
    cost: "Often included in booking software",
    synergies: ["scheduling", "followup", "reviews"],
    tools: [
      { name: "Cal.com", url: "https://cal.com", tier: "freemium", note: "Bookings + reminders" },
      { name: "Fresha", url: "https://www.fresha.com", tier: "freemium", note: "Salon/clinic bookings + SMS" },
    ],
    honestNote:
      "Most booking systems include reminders — switch them on before adding anything new.",
    notReallyAI: true,
    tiers: [
      { level: "Quick Win", time: "30 minutes", what: "Turn on automatic email/SMS reminders in your booking tool.", impact: "No-shows drop from the very next day." },
      { level: "Workflow Fix", time: "An hour", what: "Add one-tap reschedule and a confirmation step to reminders.", impact: "Would-be no-shows rebook instead of vanishing." },
      { level: "Built right", time: "1–2 weeks", what: "Auto-offer freed slots to a waitlist and confirm the first taker.", impact: "Cancellations get re-filled without you lifting a finger." },
    ],
    playbook: {
      howItWorks:
        "Your booking tool already knows every appointment. You switch on reminders (with a reschedule link), so clients confirm or move rather than ghost. Add a waitlist step and, when someone cancels, the slot is offered to waiting clients automatically.",
      stack: [
        { layer: "Bookings", tool: "Cal.com / Fresha", does: "Holds appointments + client contacts." },
        { layer: "Reminders", tool: "Built-in SMS/email", does: "Confirms, reminds, enables reschedule." },
        { layer: "Waitlist", tool: "Booking tool / Make", does: "Fills freed slots automatically." },
      ],
      phases: [
        { title: "30 min — reminders on", detail: "Enable SMS/email reminders with a reschedule link and confirmation." },
        { title: "Reduce friction", detail: "Make rescheduling one tap so people move instead of no-showing." },
        { title: "Auto re-fill", detail: "Add a waitlist and offer cancellations to it automatically." },
      ],
      watchOuts: [
        "Get consent for SMS and respect opt-outs.",
        "Don't over-remind — one or two well-timed nudges beat five.",
      ],
      worthItWhen: "No-shows and unfilled cancellations are costing you real money.",
      skipIf: "You're fully booked with a waitlist and near-zero no-shows already.",
      metric: "No-show rate and time-to-refill a cancelled slot.",
      timeToValue: "30 minutes to switch on; fewer no-shows the next day.",
    },
  },

  he_intake: {
    id: "he_intake",
    name: "Digital intake & consent forms",
    category: "Admin & finance",
    problem: "Paper intake and consent forms mean chasing details, manual typing, and a clunky first impression.",
    helps: [
      "Sends intake & consent forms before the visit",
      "Stores answers digitally — no re-typing",
      "Makes the first appointment smooth and professional",
    ],
    what: "New clients get an intake and consent form to complete before they arrive, stored digitally against their record — no paper, no chasing, no re-typing.",
    why: "Appointments start on time and prepared, admin drops, and clients get a polished first experience.",
    effort: "quickwin",
    difficulty: "diy",
    impact: 6,
    setupTime: "An hour to set up",
    cost: "Free tiers cover most",
    synergies: ["scheduling", "onboarding", "he_reminders"],
    tools: [
      { name: "Tally", url: "https://tally.so", tier: "free", note: "Intake + consent forms" },
      { name: "Jotform", url: "https://www.jotform.com", tier: "freemium", note: "Health-friendly forms + e-sign" },
    ],
    honestNote:
      "This is a digital form + storage, not AI. For health data, choose a tool with the right privacy/compliance terms.",
    notReallyAI: true,
    tiers: [
      { level: "Quick Win", time: "An hour", what: "Build one digital intake + consent form and send the link when a booking is made.", impact: "No more paper forms or re-typing details." },
      { level: "Workflow Fix", time: "A few hours", what: "Auto-send the form on booking and file responses to the client record.", impact: "Every client arrives prepared, filed automatically." },
      { level: "Built right", time: "1–2 weeks", what: "Wire intake into your practice system with reminders for incomplete forms.", impact: "A smooth, compliant intake with zero chasing." },
    ],
    playbook: {
      howItWorks:
        "You build the intake and consent questions once as a digital form. When a client books, they get the link, complete it before the visit, and their answers file straight to their record — replacing paper and manual entry.",
      stack: [
        { layer: "Form", tool: "Tally / Jotform", does: "Intake + consent, with e-sign." },
        { layer: "Trigger", tool: "Booking tool / Make", does: "Sends the form on booking." },
        { layer: "Storage", tool: "Your records", does: "Files the responses to the client." },
      ],
      phases: [
        { title: "Build the form", detail: "Put your intake + consent questions into one digital form." },
        { title: "Auto-send it", detail: "Trigger the form link when an appointment is booked." },
        { title: "File + remind", detail: "Store responses to the record; nudge anyone who hasn't filled it." },
      ],
      watchOuts: [
        "Health data needs a privacy-compliant tool and secure storage — check the terms.",
        "Keep forms short; long forms don't get finished.",
      ],
      worthItWhen: "Paper intake is slowing you down or losing details.",
      skipIf: "You already have a smooth digital intake in your practice software.",
      metric: "Forms completed before the visit and admin time per client.",
      timeToValue: "An hour to build; smoother from the next booking.",
    },
  },

  ho_reservations: {
    id: "ho_reservations",
    name: "Reservation & no-show manager",
    category: "Operations",
    problem: "Tables get held for guests who never show, and juggling bookings by phone and notebook is chaos on a busy night.",
    helps: [
      "Takes reservations online with confirmations",
      "Sends reminders and easy cancel/reschedule",
      "Fills gaps from a waitlist when tables free up",
    ],
    what: "Guests book online and get confirmations + reminders; cancellations are easy, and freed tables get offered to your waitlist automatically.",
    why: "Fewer no-shows and better-filled tables protect covers on your busiest nights, with less phone chaos.",
    effort: "quickwin",
    difficulty: "diy",
    impact: 7,
    setupTime: "An hour to set up",
    cost: "Free/low tiers available",
    synergies: ["scheduling", "reviews", "ho_menu"],
    tools: [
      { name: "Cal.com", url: "https://cal.com", tier: "freemium", note: "Simple bookings + reminders" },
      { name: "Google Reserve / OpenTable", url: "https://www.opentable.com", tier: "paid", note: "Restaurant-grade" },
    ],
    honestNote:
      "Reservation software isn't AI — it's booking + reminders. Start with a free tool before a paid platform.",
    notReallyAI: true,
    tiers: [
      { level: "Quick Win", time: "An hour", what: "Put a booking link on your site and socials with automatic confirmations + reminders.", impact: "Fewer no-shows and less phone tag immediately." },
      { level: "Workflow Fix", time: "A few hours", what: "Add easy cancel/reschedule and a deposit for large parties.", impact: "Held tables get freed early instead of sitting empty." },
      { level: "Built right", time: "1–2 weeks", what: "Auto-offer freed tables to a waitlist and sync with your floor plan.", impact: "Tighter covers on busy nights, managed automatically." },
    ],
    playbook: {
      howItWorks:
        "Guests self-book from your real availability and get confirmations + reminders, so fewer forget. Easy cancellation frees tables early, and a waitlist step re-offers those tables to guests hoping for a spot.",
      stack: [
        { layer: "Bookings", tool: "Cal.com / OpenTable", does: "Online reservations + availability." },
        { layer: "Reminders", tool: "Built-in SMS/email", does: "Confirm, remind, enable cancel." },
        { layer: "Waitlist", tool: "Booking tool", does: "Re-fills freed tables." },
      ],
      phases: [
        { title: "Set up bookings", detail: "Add a booking link everywhere with confirmations + reminders." },
        { title: "Ease cancellations", detail: "One-tap cancel/reschedule; consider deposits for big parties." },
        { title: "Add a waitlist", detail: "Offer freed tables to waiting guests automatically." },
      ],
      watchOuts: [
        "Keep availability accurate to avoid double-bookings.",
        "Reminders shouldn't feel spammy — one confirmation, one reminder.",
      ],
      worthItWhen: "No-shows and phone-booking chaos are hurting busy services.",
      skipIf: "You're walk-in only and don't take reservations.",
      metric: "No-show rate and covers filled on peak nights.",
      timeToValue: "An hour to set up; fewer no-shows this week.",
    },
  },

  ho_menu: {
    id: "ho_menu",
    name: "Menu & specials content",
    category: "Marketing",
    problem: "Menu descriptions and daily specials go stale, and posting them everywhere is one more job in a busy day.",
    helps: [
      "Writes appetising menu and specials descriptions",
      "Turns today's special into ready-to-post content",
      "Keeps your online presence current without the effort",
    ],
    what: "Turn dishes and daily specials into mouth-watering descriptions and ready-to-post social/menu content — in your voice, in minutes.",
    why: "Fresh, appealing content brings people in and keeps your channels alive without adding to the kitchen's load.",
    effort: "quickwin",
    difficulty: "diy",
    impact: 5,
    setupTime: "Start today",
    cost: "Free tier works",
    synergies: ["content", "socials", "reviews"],
    tools: [
      { name: "Claude", url: "https://claude.ai", tier: "freemium", note: "Dish → tasty description" },
      { name: "Buffer", url: "https://buffer.com", tier: "freemium", note: "Schedule the specials posts" },
    ],
    tiers: [
      { level: "Quick Win", time: "Today", what: "Give AI the dish + ingredients and get a tasty description for the menu or a post.", impact: "Appealing copy without staring at a blank page." },
      { level: "Workflow Fix", time: "An hour", what: "Batch a week of specials posts and schedule them to publish.", impact: "Your feed stays fresh through a busy week." },
      { level: "Built right", time: "1–2 weeks", what: "Today's special → auto-generate post + update the online menu.", impact: "Specials are live everywhere with one entry." },
    ],
    playbook: {
      howItWorks:
        "You give the AI the dish and its ingredients with your tone, and it writes an appealing description you can drop on the menu or turn into a post. Batch a week of specials in one sitting and schedule them so your channels never go quiet.",
      stack: [
        { layer: "Writer", tool: "Claude", does: "Dish → appetising description." },
        { layer: "Scheduler", tool: "Buffer", does: "Queues the specials posts." },
      ],
      phases: [
        { title: "Today — one description", detail: "Feed a dish + ingredients + tone; get menu/post copy." },
        { title: "Batch a week", detail: "Do a week of specials at once and schedule them." },
        { title: "Automate", detail: "Wire today's special to auto-post and update the online menu." },
      ],
      watchOuts: [
        "Keep descriptions accurate — don't oversell ingredients you don't use.",
        "Photos still matter most on food posts; pair copy with a good image.",
      ],
      worthItWhen: "Your channels go quiet and menu copy feels flat.",
      skipIf: "You have a set menu and don't run specials or socials.",
      metric: "Posting consistency and reach/engagement on specials.",
      timeToValue: "Today — first tasty description in minutes.",
    },
  },

  co_leadmagnet: {
    id: "co_leadmagnet",
    name: "Lead magnet funnel",
    category: "Marketing",
    problem: "You have followers and interest, but no simple way to turn them into an email list you can actually nurture.",
    helps: [
      "Creates a valuable freebie (quiz, guide, mini-course)",
      "Captures emails and delivers it automatically",
      "Kicks off a nurture sequence toward your offer",
    ],
    what: "A useful free resource (a guide, quiz, or mini-course) captures emails, delivers instantly, and drops new subscribers into a nurture sequence toward your paid offer.",
    why: "It turns fleeting attention into an owned audience you can sell to again and again — the foundation of course/coaching sales.",
    effort: "project",
    difficulty: "weekend",
    impact: 7,
    setupTime: "A weekend to build the first one",
    cost: "Free tiers cover it to start",
    synergies: ["content", "followup", "socials"],
    tools: [
      { name: "MailerLite", url: "https://mailerlite.com", tier: "freemium", note: "Landing + capture + nurture" },
      { name: "Claude", url: "https://claude.ai", tier: "freemium", note: "Draft the freebie + emails" },
    ],
    tiers: [
      { level: "Quick Win", time: "A few hours", what: "Draft a one-page guide with AI and put it behind an email signup form.", impact: "You start turning followers into subscribers today." },
      { level: "Workflow Fix", time: "A weekend", what: "Add a landing page, auto-delivery, and a short welcome/nurture sequence.", impact: "A hands-off funnel that captures and warms leads." },
      { level: "Built right", time: "2–3 weeks", what: "Build a quiz/mini-course magnet with segmentation into tailored nurture.", impact: "Higher-converting funnel feeding your offer on autopilot." },
    ],
    playbook: {
      howItWorks:
        "You create something genuinely useful (a guide or quiz) with AI's help, put it behind an email form on a simple landing page, and auto-deliver it. New subscribers enter a short sequence that builds trust and points to your paid offer.",
      stack: [
        { layer: "Magnet", tool: "Claude", does: "Drafts the guide/quiz content." },
        { layer: "Capture", tool: "MailerLite", does: "Landing page, form, auto-delivery." },
        { layer: "Nurture", tool: "MailerLite automation", does: "Welcome sequence toward the offer." },
      ],
      phases: [
        { title: "Pick a magnet", detail: "Choose one specific, valuable resource your audience wants now." },
        { title: "Build capture + delivery", detail: "Landing page → email form → instant delivery." },
        { title: "Weekend — nurture", detail: "Add a short welcome sequence that leads to your offer." },
      ],
      watchOuts: [
        "The freebie has to be genuinely useful, or the list won't trust or buy.",
        "Don't pitch too hard, too early — nurture before you sell.",
      ],
      worthItWhen: "You have an audience but no list, or a list you don't nurture.",
      skipIf: "You have no audience or traffic yet — build that first.",
      metric: "Signup conversion rate and list→customer conversion.",
      timeToValue: "A basic magnet today; a full funnel over a weekend.",
    },
  },

  co_lessons: {
    id: "co_lessons",
    name: "Course & lesson drafting",
    category: "Marketing",
    problem: "You know your material, but turning outlines into finished lessons, scripts and workbooks is a blank-page slog.",
    helps: [
      "Turns your outline into lesson scripts and drafts",
      "Generates worksheets, summaries and quizzes",
      "Gets a course out of your head and into shape faster",
    ],
    what: "Give your outline and expertise, and get first-draft lesson scripts, workbooks, summaries and quizzes — in your voice — to edit rather than write from scratch.",
    why: "You ship your course faster and more consistently, without the module-by-module blank-page grind.",
    effort: "quickwin",
    difficulty: "diy",
    impact: 6,
    setupTime: "Start today",
    cost: "Free tier works; ~€18/mo for heavy use",
    synergies: ["content", "co_leadmagnet", "socials"],
    tools: [
      { name: "Claude", url: "https://claude.ai", tier: "freemium", note: "Outline → lesson drafts" },
      { name: "Notion", url: "https://www.notion.so", tier: "freemium", note: "Organise the course" },
    ],
    tiers: [
      { level: "Quick Win", time: "Today", what: "Feed a module outline + your key points and get a lesson script draft to edit.", impact: "Modules move from idea to draft in minutes." },
      { level: "Workflow Fix", time: "A few hours", what: "Generate matching worksheets, summaries and quizzes per lesson.", impact: "A complete lesson package, not just a script." },
      { level: "Built right", time: "1–2 weeks", what: "Build a repeatable course-production pipeline from outline to publishable set.", impact: "Produce and refresh courses far faster." },
    ],
    playbook: {
      howItWorks:
        "You bring the expertise and the outline; the AI turns each module into a first-draft script and supporting materials in your voice. You edit for accuracy and personality — it accelerates the drafting, it doesn't replace your teaching.",
      stack: [
        { layer: "Source", tool: "Your outline + notes", does: "The expertise and structure." },
        { layer: "Drafting", tool: "Claude", does: "Scripts, worksheets, quizzes." },
        { layer: "Organise", tool: "Notion", does: "Keeps the course in order." },
      ],
      phases: [
        { title: "Today — one lesson", detail: "Feed a module outline + your points; get a script draft to edit." },
        { title: "Round it out", detail: "Generate the worksheet, summary and quiz for that lesson." },
        { title: "Systematise", detail: "Reuse the prompts across modules for a consistent production flow." },
      ],
      watchOuts: [
        "Edit heavily — raw AI teaching sounds generic and won't reflect your method.",
        "You're the expert; verify every claim and example.",
      ],
      worthItWhen: "You have the knowledge but keep stalling on producing the material.",
      skipIf: "Your course is already built, or you prefer to write it all yourself.",
      metric: "Modules produced per week and time from outline to publishable.",
      timeToValue: "Today — your first lesson drafted in minutes.",
    },
  },

  sa_onboardemails: {
    id: "sa_onboardemails",
    name: "Product onboarding emails",
    category: "Marketing",
    problem: "People sign up but never reach the 'aha' moment — so they drift off before they ever see the value.",
    helps: [
      "Guides new users to their first win with timed emails",
      "Triggers on what they have (and haven't) done",
      "Lifts activation without a bigger team",
    ],
    what: "A behavior-based email sequence walks each new signup to their first real win — nudging the steps they haven't done yet.",
    why: "Activation is where retention starts. Getting more signups to value is often the highest-leverage growth you can do.",
    effort: "project",
    difficulty: "weekend",
    impact: 7,
    setupTime: "A weekend to map + build",
    cost: "Free tiers to start; scales with users",
    synergies: ["onboarding", "followup", "sa_churn"],
    tools: [
      { name: "Loops", url: "https://loops.so", tier: "freemium", note: "Product onboarding emails" },
      { name: "Customer.io", url: "https://customer.io", tier: "paid", note: "Behavior-based messaging" },
    ],
    tiers: [
      { level: "Quick Win", time: "A few hours", what: "Write a 3-email welcome series pointing users to the one key first action.", impact: "More signups take the step that shows them value." },
      { level: "Workflow Fix", time: "A weekend", what: "Make it behavior-based: only nudge steps a user hasn't completed.", impact: "Relevant nudges that actually move activation." },
      { level: "Built right", time: "2–4 weeks", what: "Full lifecycle messaging tied to product events across email + in-app.", impact: "A durable lift in activation and early retention." },
    ],
    playbook: {
      howItWorks:
        "You define the single most important first action (the 'aha'). New users enter a short sequence that guides them to it; as your product reports what they've done, the messaging adapts — nudging only the steps still outstanding, and easing off once they're active.",
      stack: [
        { layer: "Events", tool: "Your product / analytics", does: "Signals what each user has done." },
        { layer: "Messaging", tool: "Loops / Customer.io", does: "Sends the behavior-based sequence." },
      ],
      phases: [
        { title: "Define the 'aha'", detail: "Pick the one action that predicts a user sticking around." },
        { title: "Write the welcome series", detail: "3 emails guiding toward that action; ship it first." },
        { title: "Weekend — make it behavioral", detail: "Trigger on events so you only nudge what's undone." },
      ],
      watchOuts: [
        "Don't blast every user the same emails — irrelevance kills activation flows.",
        "Fix an unclear first-run experience too; email can't rescue a confusing product.",
      ],
      worthItWhen: "Signups routinely fail to reach first value and drift away.",
      skipIf: "Activation is already strong, or you have almost no signups yet.",
      metric: "Activation rate (signup → first key action) and early retention.",
      timeToValue: "Welcome series live in hours; behavioral version over a weekend.",
    },
  },

  sa_churn: {
    id: "sa_churn",
    name: "Churn-risk alerts",
    category: "Operations",
    problem: "You find out an account is unhappy only after they've already cancelled — too late to save them.",
    helps: [
      "Watches usage for early warning signs",
      "Flags at-risk accounts before they churn",
      "Gives you a chance to reach out while it still matters",
    ],
    what: "Usage signals (drop-off, missed logins, unused features) are watched automatically, and at-risk accounts get flagged so you can step in before they cancel.",
    why: "Saving an existing customer is far cheaper than winning a new one — and most churn is preventable if you see it coming.",
    effort: "project",
    difficulty: "weekend",
    impact: 7,
    setupTime: "A weekend to define + wire",
    cost: "Free tiers cover low volume",
    synergies: ["reporting", "data", "sa_onboardemails"],
    tools: [
      { name: "Make", url: "https://make.com", tier: "freemium", note: "Watch signals, raise alerts" },
      { name: "Google Sheets", url: "https://sheets.google.com", tier: "free", note: "Usage + risk scoring" },
    ],
    tiers: [
      { level: "Quick Win", time: "A few hours", what: "Pull key usage into a sheet and manually flag accounts whose activity dropped.", impact: "You start spotting risk before the cancel button." },
      { level: "Workflow Fix", time: "A weekend", what: "Automate a simple risk score and alert you (or CS) when it crosses a threshold.", impact: "At-risk accounts surface automatically, in time to act." },
      { level: "Built right", time: "2–4 weeks", what: "Wire signals to your CRM with playbooks/automated check-ins per risk level.", impact: "A proactive retention system, not fire-fighting cancellations." },
    ],
    playbook: {
      howItWorks:
        "You decide which behaviors signal risk (logins dropping, a key feature unused, support silence). Those signals feed a simple score; when an account crosses the line, you (or your CS person) get an alert with the context — so you reach out while it can still change the outcome.",
      stack: [
        { layer: "Signals", tool: "Product data / Sheets", does: "Usage metrics per account." },
        { layer: "Scoring", tool: "Make + rules", does: "Turns signals into a risk flag." },
        { layer: "Alert", tool: "Slack / email / CRM", does: "Surfaces at-risk accounts to act on." },
      ],
      phases: [
        { title: "Define risk", detail: "Pick 3–4 behaviors that reliably precede churn for you." },
        { title: "Score + review", detail: "Combine them into a simple score; sanity-check on recent churns." },
        { title: "Weekend — automate alerts", detail: "Fire an alert with context when an account crosses the threshold." },
      ],
      watchOuts: [
        "A score with no follow-up action is useless — pair alerts with a clear play.",
        "Avoid alert fatigue; tune thresholds so flags stay meaningful.",
      ],
      worthItWhen: "You lose customers you could have saved with earlier outreach.",
      skipIf: "You have very few accounts you already know personally.",
      metric: "Churn rate and share of at-risk accounts saved after outreach.",
      timeToValue: "Manual flags this week; automated alerts after a weekend.",
    },
  },
};
