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

  // ---- Industry-specific ----
  { id: "re_listing", label: "Writing listing descriptions", note: "Every property needs fresh, sellable copy" },
  { id: "re_matchalert", label: "Matching buyers to new listings", note: "Right buyers hear about it too late" },
  { id: "tr_report", label: "Writing up job/progress reports", note: "Site photos never become a tidy update" },
  { id: "tr_estimate", label: "Pricing jobs from your rates", note: "Every estimate is done from scratch" },
  { id: "pr_docsum", label: "Reading long documents & contracts", note: "Hours lost digging for the key points" },
  { id: "pr_deadlines", label: "Tracking client deadlines & filings", note: "A missed date is a real problem" },
  { id: "ec_cart", label: "Recovering abandoned carts", note: "Ready-to-buy customers just vanish" },
  { id: "ec_productdesc", label: "Writing product descriptions", note: "Hundreds of SKUs, no time to describe them" },
  { id: "ag_report", label: "Building client reports", note: "Monthly reporting eats a whole day" },
  { id: "ag_scope", label: "Writing scopes & statements of work", note: "Turning a brief into a SOW takes hours" },
  { id: "he_reminders", label: "Cutting no-shows & rebooking", note: "Empty slots you can't fill in time" },
  { id: "he_intake", label: "Collecting intake & consent forms", note: "Paper forms and chasing details" },
  { id: "ho_reservations", label: "Managing reservations & no-shows", note: "Tables held for people who don't show" },
  { id: "ho_menu", label: "Keeping menus & specials fresh", note: "Descriptions and specials go stale" },
  { id: "co_leadmagnet", label: "Turning interest into leads", note: "Followers who never join your list" },
  { id: "co_lessons", label: "Creating course & lesson material", note: "The blank page for every module" },
  { id: "sa_onboardemails", label: "Onboarding new users to activation", note: "Signups that never reach the 'aha'" },
  { id: "sa_churn", label: "Spotting accounts about to churn", note: "You find out only once they've left" },
];
