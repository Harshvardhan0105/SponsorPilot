# SponsorPilot — ContextCon 03 Implementation Plan (V2)

**Status:** implementation blueprint, NOT evidence that a feature has been built.  
**Date:** 31 October 2026 · IIT Bombay · Two-person team  
**Authoritative detailed specification:** [`SponsorPilot_Blueprint_V2.pdf`](SponsorPilot_Blueprint_V2.pdf).  
**If this condensed Markdown differs from the PDF, use the PDF and ask the project owner.**

## 1. What we are building and why

SponsorPilot is an **autonomous sponsorship strategy and outreach-preparation agent** for student teams, clubs, technical organizations, events and similar small organizations.

The current manual service: student sponsorship leads build lists of potential sponsors, research firms in relevant sectors (OEMs, electronics manufacturers, software vendors), search contacts through Apollo/ContactOut, deduplicate records, write many introductory messages and track replies. A relatively small share of contacts converts to meetings. For today's hackathon, **replace the research, qualification, needs matching, sponsorship ask selection and first-pitch drafting service**—not human negotiation, signed deals, or actual email sending.

Given the organization's approved facts, geographic scope and concrete needs, SponsorPilot must:

1. Search real companies, preferably via Crustdata.
2. Distinguish relevant companies from plausible but irrelevant ones; explicitly **reject** poor matches with evidence.
3. Connect a **real team need** to a **verified company product or capability**.
4. Decide a justifiable **sponsorship ask type** (in-kind fabrication, evaluation units, licenses, discounted services, or cash where supported).
5. Locate an appropriate present-day business contact only if the data supports it; otherwise mark **contact not verified**, without guessing.
6. Draft **distinct, evidence-grounded** initial outreach packages for qualified prospects, with citations, uncertainty labels, and a copy/export mechanism.
7. Show a useful high-level **agent activity / decision trace**, including retries and rejections.

**Positioning:** A sponsorship **strategist**, not a generic lead-list builder. Avoid claiming to have invented AI prospecting; existing services overlap. The distinctive workflow is **organization need → verified company capability → sponsorship ask → tailored evidence-backed draft**.

**Primary example:** Team Rakshak, IIT Bombay, a UAV engineering team seeking PCB fabrication, avionics components, engineering software or competition support. A second, truly unseen brief (e.g. a solar-car team seeking batteries or a club needing printing) must be supported without code changes.

**Customer claims:** Campus teams save volunteer time but have small budgets; business willingness to pay for NGOs, events, and recurring partnership teams is a hypothesis to test, not a proven market.

## 2. Official ContextCon 03 requirements

- Build window: **31 Oct 2026, 10:30 AM–3:30 PM**. User aims to stop at **1:30 PM**, so a valid minimal submission should happen before leaving whenever possible.
- Deliverables: **public GitHub repository**, **two-minute Loom/screen-recorded demo**, project/team/theme details, team/member details in the submission form.
- Video: demonstrate an **unseen input from request to finished work**. Show sources and where claims came from. The judging panel starts from the README and video.
- No agent contact with **external real people** during the event. Email outputs are **drafts only**; no actual mass outreach, externally sent messages or uncontrolled payments.
- Allowed app forms: single/multiple agents, MCP, CLI or web app. Any coding tools/models are allowed.
- Crustdata requirement discrepancy: the shared handbook says mandatory, the organizer event deck explicitly says optional. **This project will use Crustdata**, making the conflict irrelevant for implementation. Confirm any uncertain requirement with organizers.
- Handbook states eligibility restricted to **IIT Bombay 3rd/4th-year BTech, dual-degree, and MTech students**; confirm both team members' eligibility with organizers.
- Keep notes on failed approaches, messy data and tool failures. Commit work incrementally; keep secrets out of the repo.

### Judging rubric (100 points)

| Criterion | Points | SponsorPilot demonstration |
|---|---:|---|
| End-to-end execution | 25 | Unseen brief → verified company leads → strategy → complete drafts/export |
| Facts and verification | 20 | Linked sources, provenance, no fictitious people/emails, approved team facts only |
| Robustness/edge cases | 20 | Visible company rejection; missing-contact fallback; bounded 429/timeouts; partial results |
| Customer value and idea | 20 | Real campus partnership workflow; clear needs-to-ask differentiation; honest market claims |
| Demo and understanding | 15 | Understandable, working 2-minute demonstration; explicit technical limitations |

**When sources conflict:** Use organizer's latest on-site communication for finals schedule. Both handbook and event deck agree on **3:30 PM** submission.

## 3. Scope and prioritization

### P0 — must be operational

- Real Crustdata company search and source capture.
- One relevant **and** one irrelevant company qualification/rejection path.
- Evidence-based company capability → sponsorship need → ask decision.
- At least one and ideally three differentiated, grounded outreach drafts.
- Explicit unknown data markers and a team-fact provenance guard.
- A UI with four connected areas: **brief**, **agent trace and rejections**, **qualified leads/evidence**, **draft preview with copy/JSON download**.
- An unfamiliar new brief working without changing code.
- Public repo, tested README, accessible video, valid submission.

### P1 — only after P0 is stable

- Current-role contact search; verify roles, never invent email addresses.
- One bounded alternate query if original search returns weak candidates.
- Better partial-error UX, reliable deduplication and fixture tests.

### P2 — explicitly postpone

Actual email sends, bulk campaigns, inbox/auth/CRM integrations, reply simulation, booking meetings, payment, database/authentication, polished extra dashboard pages, high-volume enrichment, complex analytics.

## 4. Design decisions and source guards

Use an LLM only for open-ended decisions: search query planning, relevance judgments, need-to-capability mapping, best ask, optional role recommendations and grounded language generation. Use **deterministic code** for API permissions, input schema, deduplication, evidence requirements, source provenance, retry bounds and hard **no-send** enforcement.

Each substantive claim should carry one origin:

- `crustdata` — returned company/person data, attached to a traceable record or URL;
- `public_url` — directly retrieved source link;
- `team_approved` — organization facts expressly approved for outward use;
- `user_assertion` — user input that has *not* been independently validated.

A student's unapproved claim such as **“we won a global championship”** must not be asserted in an outgoing draft. Company facts in emails must have matching source references; otherwise omit them or qualify them as unknown. Do not invent previous sponsorships, conversion odds, revenue, employee counts, contact emails or current job titles. A reputable retailer can still be **rejected for capability mismatch**; do not label such a company fraudulent.

### Example sponsorship rules (examples, not guarantees)

| Team need | Independent capability evidence | Possible ask |
|---|---|---|
| PCB prototyping/assembly | Company demonstrably fabricates PCBs/assembles electronics | In-kind PCB production or discount |
| Flight-control sensors | Verified seller/manufacturer of sensors or avionics | Evaluation parts, components, discount |
| CAD/EDA tools | Vendor offers relevant engineering software | Student licenses, workshops, training |
| Competition travel | Supported corporate partnerships/CSR fit | Cash sponsorship/event support; disclose uncertainty |

## 5. Agent state machine and error recovery

`INTAKE → PLAN → DISCOVER → NORMALIZE → QUALIFY → REJECT/RESEARCH → CONTACT (optional) → SPONSORSHIP_ASK → DRAFT → VERIFY → PACKAGE`

- **Bad keyword results:** reject with evidence; if too few qualified prospects, formulate **at most one** alternative query and log why.
- **No person/contact found:** do not hallucinate a person or email; return a company-level pitch, recommended role, and `contact_not_verified`.
- **Crustdata 429/timeout/5xx:** bounded retries and backoff, return errors and any previously retrieved sourced results; **never silently switch LIVE mode to synthetic data**.
- **Weak evidence:** lower confidence/mark uncertainty, don't pretend the company sells the target service.
- **Missing runtime LLM key:** report autonomous reasoning as blocked; heuristic output, if any, must be explicitly labeled as such.
- **Duplicates:** deduplicate by company identity/domain before drafting.
- **Prompt injection from retrieved pages:** treat source text as untrusted evidence, never as agent instructions.

A successful demo should show one **plausible candidate rejected** and explain why.

## 6. Crustdata — data sources, integration, fast feasibility gate

Use actual API schema from <https://docs.crustdata.com/> and inspect live responses; do not assume endpoint response fields without checking.

| Endpoint | Purpose |
|---|---|
| Company Search | Find relevant OEMs, electronics manufacturers, software firms, suppliers |
| Company Identify/Enrich | Resolve business/domain and supporting facts |
| Person Search/Enrich | Find appropriate currently employed partnerships/marketing/business-development/university-relations person if possible |
| Web Search/Fetch | Cross-check specific manufacturing/software offerings and attach source URLs |

**Quick test before UI polish:** verify one company query works; inspect five leads for relevance; inspect person search for two companies and check whether names/current roles and emails really exist. If contact coverage is poor, **company-level pitch without guessed contacts** is acceptable. If company results are poor, import a team-owned CSV and verify companies with Crustdata where possible.

### Official organizer MCP setup for Codex (developer convenience)

```bash
codex mcp add crustdata --url https://install.crustdata.com/mcp
codex mcp login crustdata
```

The **application's runtime REST token** is separate from Codex MCP login:

```dotenv
# .env.local — never commit
CRUSTDATA_API_KEY=your_real_key
GEMINI_API_KEY=your_separate_model_api_key
```

REST base `https://api.crustdata.com`; use `Authorization: Bearer <API_KEY>` and `x-api-version: 2025-11-01`. **Neither Gemini Pro nor ChatGPT Plus automatically grants runtime API credits**. No secret key in prompts, recordings or repo.

## 7. Implementation stack and folder layout

**Google Antigravity:** sole code writer for a **single Next.js App Router + TypeScript + Tailwind** application. Use Next.js API route handlers, Zod validation and server-only API keys. **Codex:** independent read-only reviewer; reports reproducible issues, doesn't concurrently edit files. Avoid splitting a Python FastAPI backend from a Next.js frontend due to time and integration cost.

```text
SponsorPilot/
├── docs/
│   ├── SponsorPilot_Blueprint_V2.pdf
│   └── IMPLEMENTATION_PLAN.md
├── app/
│   ├── page.tsx
│   └── api/
│       ├── run/route.ts
│       └── health/route.ts
├── lib/
│   ├── crustdata.ts
│   ├── agent.ts
│   ├── strategy.ts
│   ├── validate.ts
│   └── types.ts
├── tests/
├── data/demo/            # explicitly labeled synthetic fixtures only
├── .env.example          # placeholders only, no secrets
├── package.json
└── README.md
```

No database or user sign-in is necessary for sprint MVP; in-memory run state and downloadable JSON suffice.

### Core request

`POST /api/run`

```json
{
  "team_name": "Team Rakshak",
  "team_description": "IIT Bombay student UAV engineering team",
  "team_facts": [
    {"text": "Builds UAV systems", "approved": true, "origin": "team_approved"}
  ],
  "needs": ["PCB fabrication", "avionics components"],
  "target_industries": ["electronics manufacturing", "aerospace"],
  "country": "India",
  "limit": 3
}
```

### Core response contract (illustrative shape only, not real search results)

```json
{
  "mode": "LIVE",
  "status": "completed_with_warnings",
  "qualified": [{
    "company": {"name": "...", "domain": "...", "id": "..."},
    "need_match": ["PCB fabrication"],
    "ask": {"type": "in_kind", "specific_request": "...", "reason": "..."},
    "contact": null,
    "email_draft": {"subject": "...", "body": "..."},
    "evidence": [{"claim": "...", "source_url": "...", "origin": "crustdata"}],
    "uncertainties": ["Contact not verified"]
  }],
  "rejected": [{"name": "...", "reason": "...", "evidence": []}],
  "agent_trace": [{"action": "...", "outcome": "..."}],
  "errors": []
}
```

Also implement `GET /api/health`. Validate inputs, cap runs to 1–5 leads, and log whether a response is LIVE or a clearly named DEMO fixture.

## 8. Team workflow: builder and supervisor

| Stage | Antigravity (BUILDER; only writer) | Codex + humans (AUDITOR) |
|---|---|---|
| Setup | Scaffold app, confirm keys and first real call | Human checks output fields; reviewer waits |
| Vertical slice | One company → grounded ask → unique draft | Review secrets, data handling, claim guard |
| P0 expand | Rejections, three leads, four-screen UI, retry | Test unseen brief, 429 and missing contacts |
| Submission | Fix only blockers, commit and push | Confirm README/video/public repo access |

Use **one repository and one working tree**. Have Antigravity commit a runnable slice before starting Codex review. Codex should return **BLOCKER / HIGH / MEDIUM** findings with `file:line`, reproduction, observed vs expected behavior and smallest recommended fix. Only Antigravity applies approved fixes. Pause code changes during review.

### Prompt — Antigravity PRIMARY BUILDER

```text
You are the SINGLE IMPLEMENTATION OWNER for SponsorPilot.
This is a time-critical ContextCon hackathon. Read docs/IMPLEMENTATION_PLAN.md
and docs/SponsorPilot_Blueprint_V2.pdf first; the PDF is authoritative.
Build a full-stack, runnable Next.js App Router + TypeScript + Tailwind app
in THIS repository. No separate Python backend. Zod-validate input and use
server route handlers. Prioritize one live vertical slice immediately.

A university organization enters its approved sponsorship facts and needs;
an agent uses real Crustdata company evidence, REJECTS weak-fit firms,
selects a verifiable specific ASK matching each actual company capability,
and drafts DIFFERENT grounded first emails. No real emails are sent.

Implement POST /api/run and GET /api/health. UI: brief form, actual agent
activity/rejection trace, qualified prospects/sources/uncertainties, and
pitch preview with copy and JSON download. Limit to 1-5 leads.

Read current Crustdata docs and inspect live API response shapes.
Keep CRUSTDATA_API_KEY server-only; x-api-version: 2025-11-01.
Use a runtime LLM API key if available for dynamic query planning, tool
selection, qualification, sponsorship ask decisions and grounded drafts.
Never assume user subscriptions imply runtime API access.

Core innovation: TEAM NEED -> VERIFIED COMPANY CAPABILITY -> SPECIFIC
IN-KIND/DISCOUNT/LICENSE/CASH ASK -> EVIDENCE-BACKED DRAFT.
Demonstrate at least one rejected plausible but irrelevant company.

Team facts must distinguish team_approved from user_assertion. Exclude
unapproved wins/awards from outgoing pitches. Company-specific claims must
have evidence links or be omitted. Never invent contacts, emails, company
sponsorship history, probabilities or achievements.

On weak searches, allow one alternative query. Bound retries on 429 and
partial failures. Clearly mark DEMO synthetic fixtures; never silently
substitute them when LIVE API calls fail. Add regression tests for
irrelevant company, missing contact, duplicates, failures and unknown brief.

Do not build auth, CRM, real email sending, reply simulation, unnecessary
multi-page dashboards or a separate backend. Run app and tests, keep README
accurate, and commit a runnable P0. Report blockers and mock-vs-live status.
```

### Prompt — Codex INDEPENDENT READ-ONLY REVIEWER

```text
You are an INDEPENDENT READ-ONLY CODE AUDITOR for SponsorPilot.
Read docs/IMPLEMENTATION_PLAN.md and docs/SponsorPilot_Blueprint_V2.pdf;
the PDF is authoritative. Do not modify code, reformat, auto-fix, or launch
another implementation. Inspect repository, git diff, routes, adapters,
agent decisions, validation and README. Run non-destructive checks such as
npm test and npm run build, if possible; report exact tests you executed.

Find P0 issues first: real-vs-mock Crustdata, server-only secrets, API schema
assumptions, 429/partial handling, actual query replanning, rejection of
irrelevant prospects, grounded need -> capability -> ask -> pitch, strict
team fact provenance, nonexistent contacts/emails, no email send operation,
and unseen brief behavior. Then inspect malformed inputs, duplicate records,
source URL traceability, prompt-injection safety and UI failures.

Report ranked BLOCKER/HIGH/MEDIUM findings, each with file:line,
reproduction commands, observed behavior, expected behavior and a small
fix to give Antigravity. Distinguish confirmed bugs from hypotheses.
Provide READY / READY WITH CAVEATS / NOT READY and a five-minute human
smoke test. No source edits unless the product owner explicitly instructs.
```

## 9. Essential QA and fail gates

| Test case | Expected behavior |
|---|---|
| New solar-car brief needing batteries | Search and ask strategy genuinely change; no Team Rakshak boilerplate |
| Electronics retailer with no PCB fabrication evidence | Rejected as poor fit, not called a scam |
| No person results | Honest company-level draft, contact unknown |
| Duplicate domain/identity | Only one final lead and draft |
| Crustdata 429 / empty response | Bounded retries or partial result, no fake live results |
| Unapproved world-championship claim | Never asserted as proven in outgoing email |
| Two suppliers, different products | Different, evidence-backed asks and emails |

If little time remains, STOP P1/P2 and record the minimum vertical slice. **Measure**, rather than invent, any speed improvement compared with manual research; report times and number of verified leads only after testing.

## 10. Two-minute Loom structure

| Time | Content | Proof |
|---|---|---|
| 0:00–0:15 | Team Rakshak needs and human pain | Sponsorship service framing |
| 0:15–0:40 | Live Crustdata discovery with actual links | Real data provenance |
| 0:40–1:00 | Reject an irrelevant firm and choose a better one | Agent decision and adaptation |
| 1:00–1:30 | Two distinct sponsorship asks and tailored drafts | Unique sponsorship strategist |
| 1:30–1:50 | Unknown contact or unapproved fact guard | Robust evidence handling |
| 1:50–2:00 | Export a completed outreach package, labeled NOT SENT | End-to-end deliverable |

The final README must cover the service and paying customer, what the agent *actually* does end-to-end, what remains human, implementation instructions and API/model keys, Crustdata evidence/provenance, failed experiments, tested edge cases, deferred roadmap, and accurate repo/video links.

### Before submission

- [ ] A fresh brief completes end-to-end in the browser.
- [ ] A real company result has source evidence and a defensible specific sponsorship ask.
- [ ] One irrelevant company is visibly rejected with reason.
- [ ] Unverified contact information is NOT invented.
- [ ] All email drafts are explicitly UNSENT; no actual external people contacted.
- [ ] No .env.local or API keys in repository, git history or video.
- [ ] Build/tests pass or limitations are clearly disclosed in README.
- [ ] Public GitHub repo is accessible from a private browser window.
- [ ] Two-minute Loom video link works in a private browser window.
- [ ] Team eligibility and member details confirmed; submission made before 3:30 PM.

## 11. After the hackathon

1. Pilot with Team Rakshak's existing authorized prospect CSV; study human review time and draft quality.
2. Add consent-conscious, human-controlled send, opt-outs and pipeline/response monitoring; measure real reply and meeting rates.
3. Validate willingness to pay with other campus organizations, event organizers, NGOs and early-stage partnership teams.

## Reference sources

- `SponsorPilot_Blueprint_V2.pdf` (full 13-page source specification)
- Organizer-provided ContextCon 03 handbook and Event Deck (rubric, constraints and deadlines)
- <https://docs.crustdata.com/> — schemas and supported calls
- <https://app.crustdata.com/> — account/credits

**Final judge test:** Can SponsorPilot handle a never-before-seen team brief, use genuine company evidence, reject a misleading match, propose a justified sponsor-specific ask, produce an honest pitch and explicitly state unknowns, all without emailing external people?
