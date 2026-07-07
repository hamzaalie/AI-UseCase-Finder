// Lightweight junk-signup defenses — no external service, no dependency.

/**
 * Common disposable / temp-mail domains. Not exhaustive (new ones appear
 * constantly), but blocks the usual suspects and the ones we've actually seen.
 */
const DISPOSABLE_DOMAINS = new Set<string>([
  "heavty.com",
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.info",
  "sharklasers.com",
  "grr.la",
  "10minutemail.com",
  "10minutemail.net",
  "temp-mail.org",
  "tempmail.com",
  "tempmailo.com",
  "tempmail.net",
  "yopmail.com",
  "yopmail.net",
  "getnada.com",
  "nada.email",
  "trashmail.com",
  "trashmail.de",
  "dispostable.com",
  "maildrop.cc",
  "mailnesia.com",
  "throwawaymail.com",
  "fakeinbox.com",
  "mohmal.com",
  "emailondeck.com",
  "spam4.me",
  "getairmail.com",
  "mailcatch.com",
  "moakt.com",
  "tmpmail.org",
  "tmpmail.net",
  "burnermail.io",
  "mailtemp.net",
  "inboxkitten.com",
  "1secmail.com",
  "1secmail.org",
  "1secmail.net",
  "emltmp.com",
  "luxusmail.org",
  "cloud-mail.top",
  "byom.de",
]);

/** True if the email uses a known throwaway/temp-mail domain. */
export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) return true;
  return DISPOSABLE_DOMAINS.has(domain);
}

/**
 * Honeypot check: a hidden form field real users never see or fill.
 * If it has any value, the submitter is almost certainly a bot.
 */
export function isHoneypotTripped(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}
