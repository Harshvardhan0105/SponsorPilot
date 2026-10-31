# SponsorPilot V2

> **Autonomous Sponsorship Strategy & Outreach Preparation Service**  
> *ContextCon 03 / IIT Bombay (31 Oct 2026)*  
> Built according to the SponsorPilot V2 Implementation Blueprint.

---

## 1. What Paid Work Does SponsorPilot Replace? Who Currently Does It? Who Could Realistically Pay?

* **The Replaced Workflow:** Student sponsorship executives and club managers currently spend 20–40 hours each semester manually scouring company lists (OEMs, electronics manufacturers, software vendors), guessing what to ask for, looking up people on LinkedIn/Apollo, and manually writing cold emails.
* **Who Currently Does It:** Student team executives (e.g. Team Rakshak UAV, IIT Bombay Racing, Techfest, Mood Indigo) and event sponsorship volunteers.
* **Who Could Realistically Pay:**
  * **Near-term / validated:** Student collegiate teams and campus event organizations with sponsor acquisition targets.
  * **Broader B2B market (hypotheses to validate):** University competition organizers, collegiate hackathons, non-profit STEM initiatives, and early-stage specialized engineering companies running recurring B2B partnership outreach.

---

## 2. What Happens End-to-End Now, and Where is a Human Still Needed?

### What Happens Autonomously:
1. **Intake & Team Facts Guard:** Validates user brief, separates approved team facts from unapproved user assertions, and blocks unverified competition win or award claims from outbound pitches.
2. **Strategy Planning & Discovery:** Formulates targeted search queries for material/service needs (e.g. PCB fabrication vs. sensors vs. battery packs) and queries Crustdata.
3. **Candidate Screening & Transparent Rejection:** Automatically rejects capability mismatches (e.g., rejecting consumer retail chains for industrial PCB manufacturing needs with non-pejorative reasons).
4. **Honest Contact Resolution:** Queries Crustdata for relevant partnerships/university relations roles; strictly refuses to fabricate or guess unverified email addresses.
5. **Need-to-Ask Strategy & Grounded Drafting:** Maps company capabilities to justified asks (`in_kind`, `discount`, `license`, `cash`, `technical_workshop`) and generates customized, evidence-linked pitch drafts.
6. **Safety Guard & Packaging:** Enforces the `NOT SENT` safety policy and outputs a 1-click reviewable, downloadable JSON package.

### Where a Human is Still Needed:
* **Signing agreements & legal terms:** Contractual commitments, tax exemption receipts, or university MoUs.
* **Approving official team facts:** Deciding which competition records and team achievements are officially verified.
* **Final review & sending:** Reviewing the grounded draft before clicking send from their personal institutional email.

---

## 3. What Makes Sponsor NEED-to-ASK Matching Different from Generic Lead Generation?

Generic sales tools (Apollo, Hunter, generic cold emailers) operate on a one-sided query: *"Who might buy this?"* and send the same mass template.

**SponsorPilot operates on sponsorship reciprocity:**
* *"What should our team request from this specific company?"*
* *"What evidence confirms they actually have that capability?"*
* *"Why would this company consider supporting us, and what can our team credibly offer in return?"*

| Team Need | Verified Company Evidence | Chosen Sponsorship Ask | Pitch Focus |
| :--- | :--- | :--- | :--- |
| **Custom PCB Runs** | Quick-turn fabrication, SMT assembly | `in_kind` (Board manufacturing support) | Prototyping avionics hardware in exchange for livery & whitepaper |
| **Avionics Sensors** | Tactical-grade MEMS IMU/INS manufacturer | `discount` or evaluation units | Telemetry vibration data sharing & academic case study |
| **Battery Packs (Unseen)** | Industrial lithium cell assembly, BMS testing | `in_kind` (Cell allocation / pack assembly) | Vehicle endurance validation & recruitment access |
| **Design / CAD Tools** | Engineering simulation or EDA software | `license` (Educational lab seats) | Engineering training workshops & tool adoption |
| **Travel / Cash Grant** | Verified CSR / STEM outreach programs | `cash` (Logistics/freight grant) | Title event partnership & recruitment pipeline |

---

## 4. How to Install, Run, and Choose LIVE vs. DEMO Mode

### Prerequisites
* Node.js v18+ or v20+ (tested on Node v24)
* npm

### Quickstart

```bash
# 1. Clone repository
git clone https://github.com/your-username/SponsorPilot.git
cd SponsorPilot

# 2. Install dependencies
npm install

# 3. Configure environment (Optional for DEMO mode; Required for LIVE Crustdata mode)
cp .env.example .env.local
```

### Environment Variables (`.env.local`)
```env
# Crustdata REST API Key (Enables live company and person searches)
CRUSTDATA_API_KEY=your_key_here

# Runtime LLM API Key (Optional: Gemini 1.5 Flash for dynamic planning & drafting)
GEMINI_API_KEY=your_gemini_key_here

# Optional: Default target country
DEFAULT_COUNTRY=India
```

### Choosing LIVE vs. DEMO Mode
* **LIVE Mode:** When `CRUSTDATA_API_KEY` is set in `.env.local`, SponsorPilot calls live Crustdata REST endpoints (`/company/search` and `/person/search`).
* **Transparent DEMO Mode:** When `CRUSTDATA_API_KEY` is omitted, the application runs transparently in clearly labeled **DEMO Mode** using realistic fixtures (including Team Rakshak UAV, Unseen Solar-Car battery fabrication, and Campus Event scenarios). Synthetic results are explicitly labeled `DEMO` and never masqueraded as live data.

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Tests and Production Build
```bash
# Run unit & scenario test suite
npm test

# Run Next.js production build check
npm run build
```

---

## 5. Crustdata Endpoints & Evidence Sources

SponsorPilot integrates directly with Crustdata REST API:
* **Base URL:** `https://api.crustdata.com`
* **Headers:**
  * `Authorization: Bearer <CRUSTDATA_API_KEY>`
  * `x-api-version: 2025-11-01`
  * `Content-Type: application/json`
* **Endpoints Used:**
  1. `POST /company/search`: Filtered company discovery matching keywords, industry taxonomy, and country.
  2. `POST /person/search`: Best-effort discovery of partnerships/university-relations contacts. If no contact or email is returned, SponsorPilot strictly falls back to an account-level pitch labeled `Contact not verified` without inventing dummy emails.

---

## 6. Tests & Scenario Coverage

The test suite (`tests/sponsorpilot.test.ts`) tests 7 critical safety, qualification, and robustness scenarios:
1. **Irrelevant Company Rejection:** Verifies consumer retail chains (e.g. Croma) are rejected with a specific capability mismatch reason without branding them as fraudulent.
2. **Missing Contact Fallback:** Verifies that when no qualifying contact is returned, an account-level pitch is generated and contact is honestly marked null/unverified without inventing email addresses.
3. **Duplicate Company Handling:** Verifies deduplication across domain and ID so that duplicate profiles yield a single record and no duplicate drafts.
4. **Team Facts Guard:** Injects unapproved assertions (e.g. *"We won the 2025 World Championship Gold Medal"*) and verifies they are blocked from outbound drafts.
5. **Unseen Second Brief:** Tests an unfamiliar solar-car brief needing battery fabrication, ensuring fresh search parameters and a battery-specific ask are generated rather than UAV boilerplate.
6. **Product Capability Contrast:** Tests two similar companies with different specialties (PCB vs sensors), verifying distinct ask strategies.
7. **Prompt Injection Resilience:** Tests that untrusted retrieved text containing prompt override delimiters is sanitized.

---

## 7. What Would Ship Next With More Time?

* **Pilot 1:** Import of historical student team prospect spreadsheets with human-in-the-loop sending directly via verified SMTP or Gmail OAuth.
* **Pilot 2:** Inbound reply classification (detecting meeting offers, decline notices, or referral to another colleague).
* **Extended Crustdata Enrichment:** Querying web fetch and financial growth signals to estimate corporate grant capacity.

---

## 8. Verification & Project Details

* **Event:** ContextCon 03, IIT Bombay (31 Oct 2026)
* **Team:** ContextCon Two-Person Team
* **Implementation Ownership:**
  * Single App Architecture: Next.js App Router + TypeScript + Tailwind CSS
  * Automated Test Framework: Vitest (`npm test`)
  * Validation: Zod schemas & deterministic fact guard
