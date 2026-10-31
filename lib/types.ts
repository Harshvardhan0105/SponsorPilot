import { z } from "zod";

export const TeamFactOriginSchema = z.enum([
  "team_approved",
  "user_assertion",
  "crustdata",
  "company_profile",
]);
export type TeamFactOrigin = z.infer<typeof TeamFactOriginSchema>;

export const TeamFactSchema = z.object({
  text: z.string().min(1, "Fact text cannot be empty"),
  approved: z.boolean().default(false),
  origin: TeamFactOriginSchema.default("user_assertion"),
});
export type TeamFact = z.infer<typeof TeamFactSchema>;

export const RunRequestSchema = z.object({
  team_name: z.string().min(1, "Team name is required"),
  team_description: z.string().min(1, "Team description is required"),
  team_facts: z.array(TeamFactSchema).default([]),
  needs: z.array(z.string()).min(1, "At least one need is required"),
  target_industries: z.array(z.string()).min(1, "At least one target industry is required"),
  country: z.string().default("India"),
  limit: z.number().int().min(1).max(10).default(3),
  force_mode: z.enum(["LIVE", "DEMO"]).optional(),
});
export type RunRequest = z.infer<typeof RunRequestSchema>;

export const AskTypeSchema = z.enum([
  "in_kind",
  "discount",
  "license",
  "cash",
  "technical_workshop",
]);
export type AskType = z.infer<typeof AskTypeSchema>;

export const CompanyAskSchema = z.object({
  type: AskTypeSchema,
  specific_request: z.string(),
  reason: z.string(),
});
export type CompanyAsk = z.infer<typeof CompanyAskSchema>;

export const ContactPersonSchema = z.object({
  name: z.string(),
  title: z.string(),
  email: z.string().nullable().optional(),
  linkedin_url: z.string().nullable().optional(),
  verified: z.boolean().default(false),
  role_family: z.string().default("Partnerships / Business Development"),
});
export type ContactPerson = z.infer<typeof ContactPersonSchema>;

export const EvidenceItemSchema = z.object({
  claim: z.string(),
  source_url: z.string(),
  origin: TeamFactOriginSchema,
});
export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;

export const EmailDraftSchema = z.object({
  subject: z.string(),
  body: z.string(),
});
export type EmailDraft = z.infer<typeof EmailDraftSchema>;

export const QualifiedLeadSchema = z.object({
  company: z.object({
    name: z.string(),
    domain: z.string(),
    id: z.string(),
    description: z.string().optional(),
    industry: z.string().optional(),
    location: z.string().optional(),
  }),
  need_match: z.array(z.string()),
  ask: CompanyAskSchema,
  contact: ContactPersonSchema.nullable(),
  email_draft: EmailDraftSchema,
  evidence: z.array(EvidenceItemSchema),
  uncertainties: z.array(z.string()),
});
export type QualifiedLead = z.infer<typeof QualifiedLeadSchema>;

export const RejectedLeadSchema = z.object({
  name: z.string(),
  reason: z.string(),
  evidence: z.array(z.any()).default([]),
  domain: z.string().optional(),
});
export type RejectedLead = z.infer<typeof RejectedLeadSchema>;

export const AgentTraceItemSchema = z.object({
  action: z.string(),
  outcome: z.string(),
  timestamp: z.string().optional(),
});
export type AgentTraceItem = z.infer<typeof AgentTraceItemSchema>;

export const RunResponseSchema = z.object({
  mode: z.enum(["LIVE", "DEMO"]),
  status: z.enum(["completed", "completed_with_warnings", "partial_results", "error"]),
  qualified: z.array(QualifiedLeadSchema),
  rejected: z.array(RejectedLeadSchema),
  agent_trace: z.array(AgentTraceItemSchema),
  errors: z.array(z.string()),
  execution_metrics: z
    .object({
      total_candidates_found: z.number(),
      qualified_count: z.number(),
      rejected_count: z.number(),
      wall_clock_ms: z.number(),
      has_llm_reasoning: z.boolean(),
    })
    .optional(),
});
export type RunResponse = z.infer<typeof RunResponseSchema>;

// Health response schema
export const HealthResponseSchema = z.object({
  status: z.string(),
  crustdata_configured: z.boolean(),
  llm_configured: z.boolean(),
  mode: z.enum(["LIVE", "DEMO", "HYBRID"]),
  timestamp: z.string(),
});
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
