import Link from "next/link";
import Footer from "@/components/Footer";
import { SOLUTIONS } from "@/data/solutions";
import { INDUSTRIES } from "@/data/industries";

const USE_CASE_COUNT = Object.keys(SOLUTIONS).length;
const INDUSTRY_COUNT = INDUSTRIES.length;

function Cta({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <Link
      href="/finder"
      className={`inline-block rounded-xl bg-accent px-7 py-4 text-base font-semibold text-white transition-opacity hover:opacity-90 ${className}`}
    >
      {children}
    </Link>
  );
}

const STEPS = [
  { n: "1", title: "Pick your industry", body: "Nine sectors, from trades to SaaS — so the advice fits how you actually work." },
  { n: "2", title: "Rate what wastes your time", body: "Tick the pains and how much they hurt — or just describe your situation in a sentence." },
  { n: "3", title: "Get your ranked plan", body: "A personalized roadmap: quick wins, bigger projects, tools, and an honest 'skip this if…'." },
];

const DIFFERENTIATORS = [
  {
    title: "It's honest — even when that means “don't use AI”",
    body: "Some of your pains don't need AI at all; a free tool or a settings toggle beats it. The plan tells you when — so you never overspend.",
  },
  {
    title: "No invented numbers",
    body: "You'll never see a fake “you're losing €3,200/month.” It ranks the right use cases for you and stays honest about impact.",
  },
  {
    title: "Real first steps, real tools",
    body: "Every recommendation names the actual tools (mostly free) and a phased rollout — not just “get AI.”",
  },
  {
    title: "Quick wins vs. bigger projects",
    body: "Split by impact and effort, so you know what to do yourself today and what's worth building right.",
  },
];

const FAQS = [
  {
    q: "Is it really free?",
    a: "Yes. No cost, no credit card. Most of the tools it points you to are free too.",
  },
  {
    q: "Do I have to sign up?",
    a: "No. You get your full plan without an account. You can optionally leave your email to unlock the rest and get a downloadable PDF.",
  },
  {
    q: "Does it use AI to make things up?",
    a: "No. Recommendations come from a hand-authored library, so it can't hallucinate. The optional 'describe your problem' box uses AI only to understand your words and map them to real use cases.",
  },
  {
    q: "Who built this?",
    a: "Hamza Ali at Netsol AI. It's built by a real person who builds these systems for small businesses — not a faceless tool.",
  },
];

export default function LandingPage() {
  return (
    <div>
      {/* Nav */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-6">
        <span className="font-serif text-lg font-semibold">AI Use-Case Finder</span>
        <Link href="/finder" className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-paper hover:opacity-90">
          Start free
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-5 pb-10 pt-10 text-center sm:px-6 sm:pt-16">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">For small business owners</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-6xl">
          Stop guessing where AI fits. See it in your business.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          Answer a few quick questions and get a personalized, honest plan of the AI use cases that
          actually fit your business — ranked by impact, with real tools and a first step for each.
        </p>
        <div className="mt-8">
          <Cta>Find your AI use cases →</Cta>
        </div>
        <p className="mt-4 text-sm text-muted">Free · No signup to see results · Under 60 seconds</p>
      </section>

      {/* Proof bar */}
      <section className="border-y border-ink/10 bg-white/50">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 py-5 text-center text-sm text-muted sm:px-6">
          <span>
            <span className="font-semibold text-ink">{USE_CASE_COUNT}</span> AI use cases
          </span>
          <span>
            <span className="font-semibold text-ink">{INDUSTRY_COUNT}</span> industries
          </span>
          <span>
            <span className="font-semibold text-ink">Quick wins</span> + bigger projects
          </span>
          <span>
            <span className="font-semibold text-ink">Downloadable</span> PDF plan
          </span>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-6">
        <h2 className="text-center font-serif text-3xl">How it works</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl border border-ink/10 bg-white/60 p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-bold text-white">
                {s.n}
              </span>
              <h3 className="mt-4 font-serif text-xl">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Cta>Try it now →</Cta>
        </div>
      </section>

      {/* Differentiators */}
      <section className="border-y border-ink/10 bg-white/50">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-6">
          <p className="text-center text-sm font-medium uppercase tracking-widest text-accent">Why it&apos;s different</p>
          <h2 className="mt-3 text-center font-serif text-3xl">
            Most AI tools cheerlead. This one tells you the truth.
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {DIFFERENTIATORS.map((d) => (
              <div key={d.title} className="rounded-2xl border border-ink/10 bg-paper p-6">
                <h3 className="font-serif text-lg">{d.title}</h3>
                <p className="mt-2 text-sm text-muted">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Person behind it */}
      <section className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-6">
        <h2 className="font-serif text-3xl">A real person built this</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
          I&apos;m Hamza — I build practical AI and automation systems for small businesses at Netsol AI.
          I made this tool because most &quot;AI for business&quot; advice is vague hype. This gives you a
          straight answer: what&apos;s worth doing yourself, what&apos;s worth building, and what to skip.
        </p>
        <p className="mt-4 text-sm text-muted">Hamza Ali · Netsol AI · netsolai.cz</p>
      </section>

      {/* FAQ */}
      <section className="border-t border-ink/10 bg-white/50">
        <div className="mx-auto max-w-2xl px-5 py-16 sm:px-6">
          <h2 className="text-center font-serif text-3xl">Questions</h2>
          <div className="mt-8 space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-xl border border-ink/10 bg-paper px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                  {f.q}
                  <span className="ml-2 text-muted transition-transform group-open:rotate-180" aria-hidden="true">
                    ▾
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-6">
        <h2 className="font-serif text-3xl sm:text-4xl">See where AI actually fits your business.</h2>
        <p className="mt-4 text-muted">It takes under a minute, and there&apos;s no signup to get your plan.</p>
        <div className="mt-8">
          <Cta>Find your AI use cases →</Cta>
        </div>
      </section>

      <div className="mx-auto max-w-content px-5 sm:px-6">
        <Footer />
      </div>
    </div>
  );
}
