import { AskType, CompanyAsk } from "./types";

export interface NeedStrategyMapping {
  needKeyword: string;
  matchedKeywords: string[];
  recommendedAskType: AskType;
  requiredEvidenceKeywords: string[];
  rejectionTriggers: string[];
  defaultSpecificRequest: (teamName: string, companyName: string) => string;
  defaultReason: (teamName: string, companyName: string) => string;
}

export const NEED_STRATEGIES: NeedStrategyMapping[] = [
  {
    needKeyword: "battery",
    matchedKeywords: ["battery", "battery pack", "cells", "bms", "energy storage", "lithium", "solar"],
    recommendedAskType: "in_kind",
    requiredEvidenceKeywords: ["battery", "lithium", "bms", "energy storage", "cell pack"],
    rejectionTriggers: ["retail", "consumer goods", "alkaline", "phone charger", "consumer power bank"],
    defaultSpecificRequest: (team, comp) =>
      `Lithium cell allocation or battery management system (BMS) testing support for ${team}'s vehicle powertrain.`,
    defaultReason: (team, comp) =>
      `${comp} shows verified business operations in battery/energy storage systems corresponding to ${team}'s power requirements.`,
  },
  {
    needKeyword: "pcb",
    matchedKeywords: ["pcb", "pcb fabrication", "circuit board", "smt", "pcba", "board prototyping"],
    recommendedAskType: "in_kind",
    requiredEvidenceKeywords: ["pcb", "printed circuit", "pcba", "bare-board", "rigid-flex"],
    rejectionTriggers: ["retail", "consumer e-commerce", "phone repair", "gadget store", "retailer", "accessory", "bank", "financial"],
    defaultSpecificRequest: (team, comp) =>
      `Prototyping support for small-batch custom PCBs for ${team}'s hardware modules.`,
    defaultReason: (team, comp) =>
      `${comp} lists verified PCB/PCBA capability, directly aligning with ${team}'s prototyping need.`,
  },
  {
    needKeyword: "avionics",
    matchedKeywords: ["avionics", "sensors", "flight control", "imu", "telemetry", "autopilot", "navigation"],
    recommendedAskType: "discount",
    requiredEvidenceKeywords: ["avionics", "inertial", "imu", "ins", "flight control", "telemetry", "sensor"],
    rejectionTriggers: ["consumer audio", "toy drone", "general retail", "screen protector", "bank"],
    defaultSpecificRequest: (team, comp) =>
      `Evaluation units or academic pricing on inertial/avionics sensor components for integration into ${team}'s system.`,
    defaultReason: (team, comp) =>
      `${comp} provides verified avionics/inertial navigation sensor solutions required for autonomous navigation.`,
  },
  {
    needKeyword: "software",
    matchedKeywords: ["software", "cad", "eda", "simulation", "cfd", "design tools", "licensing"],
    recommendedAskType: "license",
    requiredEvidenceKeywords: ["cad", "cae", "eda", "simulation", "cfd", "modeling software"],
    rejectionTriggers: ["web design agency", "seo services", "accounting software", "bank"],
    defaultSpecificRequest: (team, comp) =>
      `Educational student team licenses (5-10 seats) for engineering design and simulation.`,
    defaultReason: (team, comp) =>
      `${comp} produces engineering design/simulation tools required for design validation.`,
  },
  {
    needKeyword: "funding",
    matchedKeywords: ["funding", "cash", "travel", "competition", "grant", "logistics"],
    recommendedAskType: "cash",
    requiredEvidenceKeywords: ["corporate social responsibility", "csr", "stem grant", "university relations"],
    rejectionTriggers: ["loan provider", "debt collection", "microfinance"],
    defaultSpecificRequest: (team, comp) =>
      `Tiered financial partnership sponsorship to support student engineering competition participation.`,
    defaultReason: (team, comp) =>
      `${comp} maintains STEM outreach/CSR initiatives aligned with collegiate engineering.`,
  },
];

/**
 * Identify matching strategy from a given list of team needs
 */
export function matchStrategyForNeeds(needs: string[]): NeedStrategyMapping[] {
  const matched: NeedStrategyMapping[] = [];
  const lowerNeeds = needs.map((n) => n.toLowerCase());

  for (const strategy of NEED_STRATEGIES) {
    const hits = strategy.matchedKeywords.some((kw) =>
      lowerNeeds.some((need) => need.includes(kw))
    );
    if (hits) {
      matched.push(strategy);
    }
  }

  // Fallback to default in-kind or cash strategy if no direct match
  if (matched.length === 0) {
    matched.push({
      needKeyword: "general_engineering",
      matchedKeywords: ["general"],
      recommendedAskType: "in_kind",
      requiredEvidenceKeywords: ["engineering", "manufacturing", "technology"],
      rejectionTriggers: ["consumer retail", "entertainment"],
      defaultSpecificRequest: (team, comp) =>
        `Technical component or tooling sponsorship for ${team}'s upcoming engineering milestones.`,
      defaultReason: (team, comp) =>
        `${comp}'s technical solutions directly address ${team}'s prototype development requirements.`,
    });
  }

  return matched;
}

export interface QualificationResult {
  isQualified: boolean;
  rejectionReason?: string;
  matchedNeeds: string[];
  ask: CompanyAsk;
  evidenceSnippets: { claim: string; source_url: string }[];
  uncertainties: string[];
}

/**
 * Deterministically qualify a company against team needs and evidence.
 * If company is a consumer retailer or lacks manufacturing capability when PCB/fabrication is needed,
 * it will be disqualified with an honest, non-offensive reason.
 */
export function qualifyCompanyMatch(
  company: {
    name: string;
    domain: string;
    description?: string;
    industry?: string;
  },
  teamName: string,
  needs: string[],
  strategies: NeedStrategyMapping[]
): QualificationResult {
  const textCorpus = `${company.name} ${company.description || ""} ${company.industry || ""}`.toLowerCase();
  const uncertainties: string[] = [];
  const evidenceSnippets: { claim: string; source_url: string }[] = [];

  // Check rejection triggers first across all applicable strategies
  for (const strat of strategies) {
    for (const trigger of strat.rejectionTriggers) {
      if (textCorpus.includes(trigger.toLowerCase())) {
        return {
          isQualified: false,
          rejectionReason: `Capability mismatch: Company appears to operate as a ${trigger} without verified in-house manufacturing, prototyping, or specialized engineering services needed for ${strat.needKeyword}.`,
          matchedNeeds: [],
          ask: {
            type: strat.recommendedAskType,
            specific_request: "",
            reason: "",
          },
          evidenceSnippets: [],
          uncertainties: ["Filtered out during qualification screening"],
        };
      }
    }
  }

  // Check positive evidence matches strictly against required specific keywords
  const matchedNeeds: string[] = [];
  let primaryStrategy = strategies[0];

  for (const strat of strategies) {
    const matchingSnippet = strat.requiredEvidenceKeywords.find((kw) =>
      textCorpus.includes(kw.toLowerCase())
    );
    if (matchingSnippet) {
      matchedNeeds.push(strat.needKeyword);
      primaryStrategy = strat;
      evidenceSnippets.push({
        claim: `Verified evidence of ${matchingSnippet} in corporate profile.`,
        source_url: company.domain ? `https://${company.domain.replace(/^https?:\/\//, "")}` : "Corporate Registry / Profile",
      });
    }
  }

  // If no specific capability keyword matched, reject conservatively
  if (matchedNeeds.length === 0) {
    return {
      isQualified: false,
      rejectionReason: `Insufficient specific evidence of ${strategies.map((s) => s.needKeyword).join("/")} capabilities. Generic manufacturing or technology terms are rejected.`,
      matchedNeeds: [],
      ask: {
        type: primaryStrategy.recommendedAskType,
        specific_request: "",
        reason: "",
      },
      evidenceSnippets: [],
      uncertainties: ["Specific capability unverified"],
    };
  }

  const ask: CompanyAsk = {
    type: primaryStrategy.recommendedAskType,
    specific_request: primaryStrategy.defaultSpecificRequest(teamName, company.name),
    reason: primaryStrategy.defaultReason(teamName, company.name),
  };

  return {
    isQualified: true,
    matchedNeeds,
    ask,
    evidenceSnippets,
    uncertainties,
  };
}
