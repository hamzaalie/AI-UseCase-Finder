# Lead Nurture Sequence — AI Use-Case Finder

Ready-to-paste copy for a **MailerLite automation** triggered when a subscriber
is added (i.e. someone opts in on the results screen).

**Voice:** warm, plain-language, a real person (Hamza / Netsol AI). No corporate
consulting tone. Honest — including when *not* to use AI. Never invents numbers.

**Personalization (MailerLite merge tags):** the tool stores four custom fields —
`{$industry}`, `{$tasks}`, `{$plan_url}` (interactive plan page) and `{$plan_pdf_url}`
(a one-click download of the plan as a generated PDF). Use them where marked.
If a field is empty, MailerLite shows nothing, so keep sentences readable without them too.

**How to set it up in MailerLite:**
1. Automations → Create → trigger **"When subscriber joins a group"** (or "joins" if no group).
2. Add an **Email** step for #1 (delay: immediately).
3. Add **Wait** + **Email** steps for #2–#4 with the delays below.
4. Paste each subject + body. Set the sender to your verified domain.

---

## Email 1 — Immediately · "Here's your AI playbook"

**Subject:** Your AI plan for {$industry} (as promised)
**Preview text:** The quick wins, the bigger projects, and where to actually start.

Hi,

Thanks for using the AI Use-Case Finder — here's the fuller version of your plan,
as promised.

**👉 [Download your full plan (PDF) →]({$plan_pdf_url})**
(A polished PDF of your plan — opportunity score, every use case, and the full
playbook for each. Or [view it online]({$plan_url}) to explore interactively.)

You told me the things eating your time, and the tool ranked the AI use cases that
actually fit a business like yours. Quick reminder of how to read it:

- **Quick wins** — do these yourself, often today, usually free. Start here for momentum.
- **Bigger projects** — worth setting up properly (or getting built right) because the payoff is bigger.
- **The "you don't even need AI" ones** — genuinely, sometimes a free tool or a settings toggle beats any AI. I'll always tell you when that's the case.

My one piece of advice: **pick the single quick win at the top of your list and
do just that this week.** Not all of it. One thing, finished. That's how this
actually changes your week instead of becoming another tab you never open.

Over the next few days I'll send you a few short notes — how to get the first one
working, the honest "do it yourself vs. get it built" call, and the mistakes that
quietly kill these projects.

Talk soon,
Hamza
Netsol AI · netsolai.cz

---

## Email 2 — Day 2 · "How to actually ship your first quick win"

**Subject:** The fastest win in your plan (and how to set it up)
**Preview text:** 30 minutes, free tools, no developer needed.

Hi,

Yesterday I said pick one quick win and finish it. Today, how to actually do that.

Every quick win in your plan has the same shape:

1. **Write the thing down first.** The 3 questions every lead asks, the 3 follow-up
   messages, the review request — whatever it is. The writing is 80% of the work,
   and it's the part you can't outsource to a tool.
2. **Pick one free tool** from the list I gave you. Don't research ten. Pick the
   first reasonable one and start.
3. **Make it work for one case** — one lead, one client, one invoice. Don't try to
   automate everything on day one. Get one clean win, then widen it.

The owners who get value from AI aren't the ones with the best tools. They're the
ones who finished one small thing. That's it.

If you tell me which quick win you're starting with, I'm happy to point you at the
exact tool and setup — just hit reply.

Hamza

---

## Email 3 — Day 4 · "Do it yourself, or get it built?"

**Subject:** When AI is worth paying for (and when it really isn't)
**Preview text:** The honest version most people won't tell you.

Hi,

Here's the bit most "AI for business" people won't say out loud: **a lot of this
you should just do yourself.**

A rough rule I'd use:

- **Do it yourself** if it's a quick win, the tools are free, and it's a one-time
  setup. Booking links, invoice reminders, content drafts, review requests — these
  are an afternoon, not an invoice.
- **Get it built right** if it's a bigger project that touches multiple tools, runs
  unattended, or breaks badly when it goes wrong — instant lead response, smart
  qualification, data flowing between systems. The cost of getting these subtly
  wrong is higher than the cost of doing them properly.

And sometimes the honest answer is **don't use AI at all** — if you get the same
three questions, a clear FAQ page beats any chatbot.

That honesty is the whole reason I built the tool. I'd rather you fix three things
for free than pay me for one you didn't need.

Hamza

---

## Email 4 — Day 7 · "Want a second pair of eyes?"

**Subject:** Quick offer (no pitch, promise)
**Preview text:** 15 minutes to figure out what's worth your time.

Hi,

Last note from me — then I'll get out of your inbox.

If you've started on your plan: nice. If you've looked at it and thought *"this is
useful but I don't know what's worth my time vs. worth getting built"* — that's
exactly the conversation I have with people for a living.

So here's a simple offer: a free 15-minute call where we look at your plan together
and I tell you, honestly, which one or two things are worth doing first — and which
to skip. No deck, no pitch. If it makes sense for me to build something, I'll say
so. If it doesn't, I'll say that too.

[Book a 15-min call →]({{ booking_url }})

Either way — good luck with it. You're already ahead of most people just by being
deliberate about where AI fits.

Hamza
Netsol AI · netsolai.cz

---

### Notes
- Replace `{{ booking_url }}` in Email 4 with your real Cal.com/Calendly link
  (the same one you put in `NEXT_PUBLIC_BOOKING_URL`).
- Keep all 4 emails plain-text-style (minimal images) — it lands in the inbox, not
  Promotions, and matches the "real person" voice.
- If you set a `MAILERLITE_GROUP_ID`, trigger the automation on that group so only
  tool leads get this sequence.
