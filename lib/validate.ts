import { TeamFact, ContactPerson } from "./types";

/**
 * Filter and guard team facts.
 * Unapproved claims (especially containing competition wins, awards, championships)
 * must be excluded from outgoing sponsor drafts and labeled as user assertions.
 */
export function partitionTeamFacts(facts: TeamFact[]): {
  approvedFacts: TeamFact[];
  unapprovedAssertions: TeamFact[];
} {
  const approvedFacts: TeamFact[] = [];
  const unapprovedAssertions: TeamFact[] = [];

  for (const fact of facts) {
    if (fact.approved && fact.origin === "team_approved") {
      approvedFacts.push(fact);
    } else {
      unapprovedAssertions.push({
        ...fact,
        approved: false,
        origin: "user_assertion",
      });
    }
  }

  return { approvedFacts, unapprovedAssertions };
}

/**
 * Check if a text attempts to assert an unapproved win, championship, rank, or award claim.
 */
export function containsUnapprovedAchievement(
  text: string,
  approvedFacts: TeamFact[]
): { hasViolation: boolean; detectedPhrase?: string } {
  const winKeywords = [
    /\bwon\b/i,
    /\bwinner\b/i,
    /\bchampionship\b/i,
    /\bchampion\b/i,
    /\baward\b/i,
    /\b1st place\b/i,
    /\bfirst place\b/i,
    /\bgold medal\b/i,
    /\branked #?1\b/i,
    /\bworld champion\b/i,
  ];

  for (const regex of winKeywords) {
    const match = text.match(regex);
    if (match) {
      // Check if this achievement is explicitly in the approved facts
      const isApproved = approvedFacts.some((af) =>
        af.text.toLowerCase().includes(match[0].toLowerCase())
      );
      if (!isApproved) {
        return { hasViolation: true, detectedPhrase: match[0] };
      }
    }
  }

  return { hasViolation: false };
}

/**
 * Sanitize untrusted data retrieved from external sources or Crustdata
 * to guard against prompt injection.
 */
export function sanitizeUntrustedText(input: string): string {
  if (!input) return "";
  return input
    .replace(/[<>]/g, "")
    .replace(/\b(ignore previous instructions|system prompt|disregard|send mass email)\b/gi, "[REDACTED]")
    .trim();
}

/**
 * Deduplicate companies by domain, id, or normalized name
 */
export function deduplicateCompanies<T extends { id?: string; domain?: string; name: string }>(
  items: T[]
): T[] {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const item of items) {
    const domainKey = item.domain
      ? item.domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/$/, "")
      : "";
    const idKey = item.id ? item.id.toLowerCase() : "";
    const nameKey = item.name.toLowerCase().trim().replace(/[^a-z0-9]/g, "");

    const key = domainKey || idKey || nameKey;
    if (key && !seen.has(key)) {
      seen.add(key);
      if (domainKey) seen.add(domainKey);
      if (idKey) seen.add(idKey);
      if (nameKey) seen.add(nameKey);
      result.push(item);
    }
  }

  return result;
}

/**
 * Strict contact validator: never invent emails or contact details.
 * If email is not directly verified by the data source, set to null.
 */
export function sanitizeContact(contact: ContactPerson | null | undefined): ContactPerson | null {
  if (!contact || !contact.name || contact.name.trim() === "") {
    return null;
  }

  // Validate email format if provided; do not allow fabricated dummy emails
  let validEmail: string | null = null;
  if (contact.email) {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (
      emailRegex.test(contact.email) &&
      !contact.email.includes("example.com") &&
      !contact.email.includes("test.com")
    ) {
      validEmail = contact.email;
    }
  }

  return {
    name: contact.name.trim(),
    title: contact.title.trim() || "Partnership Contact",
    email: validEmail,
    linkedin_url: contact.linkedin_url || null,
    verified: Boolean(contact.verified && validEmail),
    role_family: contact.role_family || "Partnerships / Business Development",
  };
}
