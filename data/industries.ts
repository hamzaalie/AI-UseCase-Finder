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
    weights: { leadreply: 10, followup: 9, intake: 8, reviews: 6, scheduling: 6, content: 5, socials: 4 },
  },
  {
    id: "trades",
    label: "Trades / construction",
    icon: "🔧",
    examples: "Builders, electricians, plumbers, contractors",
    blurb: "Quote fast, get booked, and get paid without the chase.",
    weights: { leadreply: 9, quoting: 9, scheduling: 7, invoicing: 7, followup: 6, reviews: 6 },
  },
  {
    id: "professional",
    label: "Accounting / legal / consulting",
    icon: "💼",
    examples: "Accountants, lawyers, advisors, consultants",
    blurb: "Protect billable time; automate the repetitive intake and admin.",
    weights: { faq: 8, intake: 8, notes: 7, invoicing: 7, reporting: 6, content: 5, onboarding: 6 },
  },
  {
    id: "ecommerce",
    label: "E-commerce / retail",
    icon: "🛍️",
    examples: "Online stores, retail, distribution",
    blurb: "Deflect support, stay visible, and turn buyers into repeat buyers.",
    weights: { faq: 9, support: 8, content: 7, data: 7, reviews: 6, reporting: 5, followup: 5, socials: 6 },
  },
  {
    id: "agency",
    label: "Agency / freelance",
    icon: "🎯",
    examples: "Agencies, freelancers, creative studios",
    blurb: "Win pitches faster and run delivery without the admin drag.",
    weights: { quoting: 9, followup: 7, content: 7, onboarding: 7, data: 6, reporting: 6, leadreply: 6 },
  },
  {
    id: "health",
    label: "Clinic / wellness / salon",
    icon: "💆",
    examples: "Clinics, salons, therapists, wellness",
    blurb: "Fill the calendar and reduce no-shows on autopilot.",
    weights: { scheduling: 10, leadreply: 8, followup: 7, reviews: 7, faq: 6, intake: 5 },
  },
  {
    id: "hospitality",
    label: "Restaurant / hospitality",
    icon: "🍽️",
    examples: "Restaurants, cafes, hotels, venues",
    blurb: "Answer fast, fill tables, and build a steady review flywheel.",
    weights: { faq: 8, scheduling: 8, reviews: 8, content: 6, socials: 6, followup: 4, data: 4 },
  },
  {
    id: "coaching",
    label: "Coaching / courses",
    icon: "🎓",
    examples: "Coaches, course creators, educators",
    blurb: "Stay top-of-mind and convert interest without 1:1 chasing.",
    weights: { content: 9, followup: 8, socials: 7, leadreply: 7, scheduling: 6, intake: 6, reviews: 5 },
  },
  {
    id: "saas",
    label: "SaaS / tech startup",
    icon: "💻",
    examples: "Software, apps, tech startups",
    blurb: "Deflect support, onboard smoothly, and let the data report itself.",
    weights: { support: 9, faq: 8, onboarding: 8, data: 7, reporting: 7, content: 6, followup: 5 },
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
