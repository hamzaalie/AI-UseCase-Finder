export interface Task {
  id: string;
  label: string; // what the owner calls it
  note: string; // the pain, one line
}

export const TASKS: Task[] = [
  { id: "leadreply", label: "Replying to new enquiries fast enough", note: "Leads go cold while you're busy" },
  { id: "followup", label: "Following up with leads who go quiet", note: "Deals die in the inbox" },
  { id: "faq", label: "Answering the same questions over and over", note: "Hours lost to repeat questions" },
  { id: "scheduling", label: "Booking appointments / back-and-forth on times", note: "Six emails to find one slot" },
  { id: "invoicing", label: "Chasing unpaid invoices", note: "Money earned, not collected" },
  { id: "content", label: "Writing posts, emails and marketing copy", note: "The weekly blank-page battle" },
  { id: "data", label: "Copying info between tools / data entry", note: "Boring, error-prone, endless" },
  { id: "reporting", label: "Pulling together reports and numbers", note: "Decisions on gut, not data" },
  { id: "quoting", label: "Writing quotes and proposals", note: "Hours per proposal, by hand" },
  { id: "reviews", label: "Remembering to ask for reviews & referrals", note: "Forgotten at the perfect moment" },
  { id: "intake", label: "Wasting calls on people who never buy", note: "Tyre-kickers drain your calendar" },
  { id: "notes", label: "Writing up call notes and next steps", note: "Things slip through the cracks" },
  { id: "socials", label: "Keeping social media active", note: "You go quiet for weeks at a time" },
  { id: "support", label: "Keeping up with the support inbox", note: "Replies pile up faster than you clear them" },
  { id: "onboarding", label: "Getting new clients set up", note: "Every onboarding is a scramble" },
];
