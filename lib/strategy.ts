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
    needKeyword: "pcb",
    matchedKeywords: ["pcb", "circuit board", "fabrication", "smt", "pcba", "prototyping"],
    recommendedAskType: "in_kind",
    requiredEvidenceKeywords: ["fabrication", "manufacturing", "pcb", "assembly", "prototyping", "board", "smt", "ems"],
    rejectionTriggers: ["retail", "consumer e-commerce", "phone repair", "gadget store", "retailer", "accessory"],
    defaultSpecificRequest: (team, comp) =>
      `Prototyping sponsorship for 5-10 small-batch multilayer PCBs and assembly assistance for ${team}'s airborne avionics modules.`,
    defaultReason: (team, comp) =>
      `${comp} possesses specialized PCB manufacturing and surface-mount assembly infrastructure, directly meeting ${team}'s hardware turnaround need.`,
  },
  {
    needKeyword: "avionics",
    matchedKeywords: ["avionics", "sensors", "flight control", "imu", "telemetry", "autopilot", "navigation"],
    recommendedAskType: "discount",
    requiredEvidenceKeywords: ["sensor", "avionics", "aerospace", "navigation", "mems", "inertial", "embedded"],
    rejectionTriggers: ["consumer audio", "toy drone", "general retail", "screen protector"],
    defaultSpecificRequest: (team, comp) =>
      `Evaluation sensor units or discounted access to high-precision IMU/avionics components for integration into ${team}'s flight stack.`,
    defaultReason: (team, comp) =>
      `${comp} supplies industrial/aerospace grade sensor solutions, eliminating single-point sensor drift in competitive flight maneuvers.`,
  },
  {
    needKeyword: "battery",
    matchedKeywords: ["battery", "battery pack", "cells", "bms", "energy storage", "lithium", "solar"],
    recommendedAskType: "in_kind",
    requiredEvidenceKeywords: ["battery", "cell", "energy storage", "pack assembly", "bms", "lithium", "power"],
    rejectionTriggers: ["retail", "consumer goods", "alkaline", "phone charger", "consumer power bank"],
    defaultSpecificRequest: (team, comp) =>
      `High-discharge lithium cell allocation and battery management system (BMS) testing support for the vehicle powertrain.`,
    defaultReason: (team, comp) =>
      `${comp} specializes in high-density battery cell fabrication and pack safety testing, vital for vehicle endurance.`,
  },
  {
    needKeyword: "software",
    matchedKeywords: ["software", "cad", "eda", "simulation", "cfd", "design tools", "licensing"],
    recommendedAskType: "license",
    requiredEvidenceKeywords: ["cad", "cae", "eda", "simulation", "software", "modeling", "finite element", "cfd"],
    rejectionTriggers: ["web design agency", "seo services", "accounting software"],
    defaultSpecificRequest: (team, comp) =>
      `Educational student team licenses (5-10 seats) and a technical mentoring session for engineering design optimization.`,
    defaultReason: (team, comp) =>
      `${comp} develops industry-standard simulation and CAD software; using it enables rapid aerodynamic validation and trains future engineering talent on their toolchain.`,
  },
  {
    needKeyword: "funding",
    matchedKeywords: ["funding", "cash", "travel", "competition", "grant", "logistics"],
    recommendedAskType: "cash",
    requiredEvidenceKeywords: ["corporate social responsibility", "csr", "stem", "university relations", "foundation", "grant"],
    rejectionTriggers: ["loan provider", "debt collection", "microfinance"],
    defaultSpecificRequest: (team, comp) =>
      `Tiered financial partnership sponsorship (travel and freight grant) to represent the institute at national/international competitions.`,
    defaultReason: (team, comp) =>
      `${comp} has an active STEM outreach and university innovation program aligning with student-led competitive engineering.`,
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

  // Check positive evidence matches
  const matchedNeeds: string[] = [];
  let primaryStrategy = strategies[0];

  for (const strat of strategies) {
    const hasEvidence = strat.requiredEvidenceKeywords.some((kw) =>
      textCorpus.includes(kw.toLowerCase())
    );
    if (hasEvidence) {
      matchedNeeds.push(strat.needKeyword);
      primaryStrategy = strat;
      evidenceSnippets.push({
        claim: `Company verified in ${strat.needKeyword} domain (${company.industry || "Hardware / Technology"}).`,
        source_url: `https://${company.domain.replace(/^https?:\/\//, "")}`,
      });
    }
  }

  // If no positive evidence matched, reject as unrelated
  if (matchedNeeds.length === 0) {
    return {
      isQualified: false,
      rejectionReason: `No verified evidence of manufacturing or specialized capability corresponding to team needs (${needs.join(", ")}).`,
      matchedNeeds: [],
      ask: {
        type: primaryStrategy.recommendedAskType,
        specific_request: "",
        reason: "",
      },
      evidenceSnippets: [],
      uncertainties: ["Unverified technical alignment"],
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
