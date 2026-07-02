export interface Industry {
  id: string;
  label: string;
  icon: string; // emoji shown on the card
  examples: string; // short "who this fits" line for the card
  blurb: string; // one-line framing shown when picked
  // industry-specific impact weight per task (1-10). Higher = more impactful here.
  // Tasks not listed still work; they get a neutral default weight in scoring.
  weights: Record<string, number>;
}

export const INDUSTRIES: Industry[] = [
  {
    id: "realestate",
    label: "Real estate",
    icon: "🏠",
    examples: "Agents, brokers, property management",
    blurb: "Speed-to-lead and follow-up win listings and buyers.",
    weights: { re_matchalert: 9, leadreply: 10, followup: 9, intake: 8, re_listing: 7, reviews: 6, scheduling: 6, content: 5, socials: 4 },
  },
  {
    id: "trades",
    label: "Trades / construction",
    icon: "🔧",
    examples: "Builders, electricians, plumbers, contractors",
    blurb: "Quote fast, get booked, and get paid without the chase.",
    weights: { tr_estimate: 9, leadreply: 9, quoting: 9, scheduling: 7, invoicing: 7, tr_report: 6, followup: 6, reviews: 6 },
  },
  {
    id: "professional",
    label: "Accounting / legal / consulting",
    icon: "💼",
    examples: "Accountants, lawyers, advisors, consultants",
    blurb: "Protect billable time; automate the repetitive intake and admin.",
    weights: { pr_docsum: 8, faq: 8, intake: 8, pr_deadlines: 7, notes: 7, invoicing: 7, reporting: 6, content: 5, onboarding: 6 },
  },
  {
    id: "ecommerce",
    label: "E-commerce / retail",
    icon: "🛍️",
    examples: "Online stores, retail, distribution",
    blurb: "Deflect support, stay visible, and turn buyers into repeat buyers.",
    weights: { ec_cart: 9, faq: 9, support: 8, ec_productdesc: 7, content: 7, data: 7, reviews: 6, reporting: 5, followup: 5, socials: 6 },
  },
  {
    id: "agency",
    label: "Agency / freelance",
    icon: "🎯",
    examples: "Agencies, freelancers, creative studios",
    blurb: "Win pitches faster and run delivery without the admin drag.",
    weights: { ag_report: 8, ag_scope: 8, quoting: 9, followup: 7, content: 7, onboarding: 7, data: 6, reporting: 6, leadreply: 6 },
  },
  {
    id: "health",
    label: "Clinic / wellness / salon",
    icon: "💆",
    examples: "Clinics, salons, therapists, wellness",
    blurb: "Fill the calendar and reduce no-shows on autopilot.",
    weights: { he_reminders: 9, scheduling: 10, leadreply: 8, followup: 7, reviews: 7, he_intake: 6, faq: 6, intake: 5 },
  },
  {
    id: "hospitality",
    label: "Restaurant / hospitality",
    icon: "🍽️",
    examples: "Restaurants, cafes, hotels, venues",
    blurb: "Answer fast, fill tables, and build a steady review flywheel.",
    weights: { ho_reservations: 9, faq: 8, scheduling: 8, reviews: 8, ho_menu: 6, content: 6, socials: 6, followup: 4, data: 4 },
  },
  {
    id: "coaching",
    label: "Coaching / courses",
    icon: "🎓",
    examples: "Coaches, course creators, educators",
    blurb: "Stay top-of-mind and convert interest without 1:1 chasing.",
    weights: { co_leadmagnet: 8, content: 9, followup: 8, co_lessons: 7, socials: 7, leadreply: 7, scheduling: 6, intake: 6, reviews: 5 },
  },
  {
    id: "saas",
    label: "SaaS / tech startup",
    icon: "💻",
    examples: "Software, apps, tech startups",
    blurb: "Deflect support, onboard smoothly, and let the data report itself.",
    weights: { sa_onboardemails: 9, sa_churn: 8, support: 9, faq: 8, onboarding: 8, data: 7, reporting: 7, content: 6, followup: 5 },
  },
  {
    id: "other",
    label: "Something else",
    icon: "✨",
    examples: "Any small business — tick what fits",
    blurb: "A broad starting set — tick what actually eats your week.",
    weights: {
      leadreply: 7,
      followup: 6,
      faq: 6,
      scheduling: 6,
      invoicing: 5,
      content: 5,
      reporting: 5,
      quoting: 5,
      reviews: 5,
      data: 5,
      intake: 5,
      notes: 4,
      socials: 4,
      support: 5,
      onboarding: 4,
    },
  },
];

// Default weight for a chosen task that isn't explicitly listed for the industry.
export const DEFAULT_WEIGHT = 4;

/** Tasks for an industry, ordered by descending weight (most impactful first). */
export function tasksForIndustry(industryId: string): string[] {
  const industry = INDUSTRIES.find((i) => i.id === industryId);
  if (!industry) return [];
  return Object.entries(industry.weights)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);
}
