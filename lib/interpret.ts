import { TASKS } from "@/data/tasks";
import type { Ratings } from "./match";

export interface InterpretResult {
  ratings: Ratings; // task id -> severity 1..3
  message: string; // short personalized summary
  source: "ai" | "keyword";
}

/**
 * No-AI fallback: scan the free-text for keywords that map to task ids.
 * Shallow by design — it only runs when no ANTHROPIC_API_KEY is configured,
 * or if the AI call fails. Everything matched is rated 2 ("hurts a lot").
 */
const KEYWORDS: Record<string, string[]> = {
  leadreply: ["reply", "respond", "enquir", "inquir", "lead", "slow to answer", "miss calls", "new customer"],
  followup: ["follow up", "follow-up", "chase", "go quiet", "go cold", "ghost", "nurtur"],
  faq: ["same question", "repeat question", "faq", "asked over", "answering questions", "hours", "open"],
  scheduling: ["book", "schedul", "appointment", "calendar", "no-show", "no show", "reschedul", "slot"],
  invoicing: ["invoice", "unpaid", "get paid", "payment", "chasing money", "overdue", "cash flow"],
  content: ["content", "post", "blog", "newsletter", "write", "copy", "caption", "marketing copy"],
  data: ["copy paste", "copy-paste", "data entry", "re-type", "retype", "between tools", "spreadsheet entry"],
  reporting: ["report", "numbers", "metrics", "dashboard", "kpi", "gut feel", "no visibility", "track"],
  quoting: ["quote", "proposal", "estimate", "bid", "pitch", "quotation"],
  reviews: ["review", "testimonial", "referral", "rating", "google review", "word of mouth"],
  intake: ["qualify", "tyre kicker", "tire kicker", "waste", "not a fit", "screening", "wrong leads", "dead-end"],
  notes: ["notes", "call notes", "meeting", "minutes", "summar", "transcri", "action items"],
  socials: ["social", "instagram", "linkedin", "facebook", "tiktok", "twitter", "posting", "go quiet"],
  support: ["support", "tickets", "inbox", "help desk", "customer service", "complaints", "queries pile"],
  onboarding: ["onboard", "new client", "kickoff", "kick off", "welcome", "setup", "get started"],
};

export function keywordInterpret(description: string): InterpretResult {
  const text = description.toLowerCase();
  const ratings: Ratings = {};
  for (const task of TASKS) {
    const hits = KEYWORDS[task.id] ?? [];
    if (hits.some((k) => text.includes(k))) ratings[task.id] = 2;
  }
  const count = Object.keys(ratings).length;
  const message =
    count > 0
      ? `I picked out ${count} area${count > 1 ? "s" : ""} from what you wrote and pre-filled them below — adjust the ratings so they match how much each really hurts.`
      : "I couldn't pull specific pains from that — tick and rate the ones below that fit.";
  return { ratings, message, source: "keyword" };
}
