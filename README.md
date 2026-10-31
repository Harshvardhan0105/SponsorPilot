# SponsorPilot V2

> **Autonomous Sponsorship Strategy & Outreach Preparation Service**  
> *ContextCon 03 / IIT Bombay (31 Oct 2026)*  
> Live Working Implementation built according to the authoritative SponsorPilot V2 Blueprint.

---

## Live Status & Submission Verification

- **Operating Status:** **LIVE** (Crustdata REST API Connected + Google Gemini 3.5 Flash Active)
- **Local Application URL:** [http://localhost:3000](http://localhost:3000)
- **Health Check:** `GET http://localhost:3000/api/health`
- **Execution Endpoint:** `POST http://localhost:3000/api/run`
- **Automated Tests:** 7/7 passing (`npm test`)
- **Production Build:** Verified zero TypeScript/build errors (`npm run build`)

---

## 1. What Paid Work Does SponsorPilot Replace? Who Currently Does It? Who Could Realistically Pay?

* **The Replaced Workflow:** Student sponsorship heads and club executives spend 20–40 volunteer hours per semester manually compiling company lists (OEMs, electronics manufacturers, software vendors), guessing what to ask for, finding contacts on Apollo/LinkedIn, and writing cold emails.
* **Who Currently Does It:** Student team executives (Team Rakshak UAV, IIT Bombay Racing, Techfest, Mood Indigo) and campus event sponsorship coordinators.
* **Who Could Realistically Pay:**
  * **Immediate segment:** University competition teams and major campus cultural/tech festivals with corporate partnership targets.
  * **Broader B2B market (hypotheses to validate):** Collegiate hackathons, non-profit student STEM foundations, and early-stage engineering companies running recurring B2B partnership and vendor outreach campaigns.

---

## 2. What Happens End-to-End Now, and Where is a Human Still Needed?

### What Happens Autonomously:
1. **Intake & Team Facts Guard:** Validates user brief, separates approved team facts from unapproved user assertions, and blocks unverified competition win/award claims from outbound pitch drafts.
2. **Autonomous Query Planning (Gemini 3.5 Flash):** Synthesizes optimized B2B keyword queries from hardware/material needs (e.g. *"PCB fabrication avionics manufacturing"*).
3. **Live Discovery (Crustdata REST API):** Queries Crustdata (`POST /company/search` with `x-api-version: 2025-11-01`) for Indian and global manufacturers.
4. **Transparent Rejection & Capability Qualification:** Screen candidates against verified technical capabilities; identifies and explicitly rejects capability mismatches (e.g., rejecting retail banks or consumer electronics retailers for PCB needs) with non-pejorative reasons.
5. **Contact Resolution (Honest Fallback):** Discovers verifiable partnerships/university relations contacts. Strictly refuses to fabricate or guess unverified email addresses, providing an account-level pitch labeled `Contact not verified`.
6. **Sponsorship Need-to-Ask Strategy:** Formulates justified asks (`in_kind`, `discount`, `license`, `cash`, `technical_workshop`) tailored to company infrastructure.
7. **Grounded Pitch Drafting:** Generates customized outreach drafts citing only confirmed company capabilities and approved team facts.
8. **Safety Policy & 1-Click Export:** Enforces `NOT SENT` local draft status and exports the complete audit package as JSON.

### Where a Human is Still Needed:
* **Legal Terms & Agreements:** Approving formal MoUs, institutional tax exemption receipts, or university sponsorship contracts.
* **Team Fact Approval:** Deciding which competition records and team achievements are officially verified before inclusion in pitches.
* **Final Sending:** Reviewing the grounded draft before clicking send from their personal institutional email.

---

## 3. What Makes Sponsor NEED-to-ASK Matching Different from Generic Lead Generation?

Generic prospecting tools (Apollo, Hunter, generic sales agents) ask: *"Who might buy this?"* and send the same mass cold-email template.

**SponsorPilot asks:**
* *"What should our team request from this specific company?"*
* *"What evidence confirms they actually have that manufacturing or tooling capability?"*
* *"Why would this company consider supporting us, and what can our team credibly offer in return?"*

| Team Need | Verified Company Evidence | Chosen Sponsorship Ask | Pitch Focus |
| :--- | :--- | :--- | :--- |
| **Custom PCB Runs** | Quick-turn fabrication, bare-board PCBs, SMT assembly | `in_kind` (Board manufacturing support) | Prototyping avionics hardware in exchange for airframe livery & technical whitepapers |
| **Avionics Sensors** | Tactical-grade MEMS IMU/INS manufacturer | `discount` or evaluation units | Telemetry vibration data sharing & academic case study |
| **Battery Packs (Unseen)** | Industrial lithium cell assembly, BMS testing | `in_kind` (Cell allocation / pack assembly) | Vehicle endurance validation & recruitment access |
| **Design / CAD Tools** | Engineering simulation or EDA software | `license` (Educational lab seats) | Engineering training workshops & tool adoption |
| **Travel / Cash Grant** | Verified CSR / STEM outreach programs | `cash` (Logistics/freight grant) | Title event partnership & recruitment pipeline |

---

## 4. Setup, Environment, and LIVE vs. DEMO Mode

### Prerequisites
* Node.js v18+ or v20+ (tested on Node v24)
* npm

### Quickstart

```bash
# 1. Clone repository
git clone https://github.com/<your-username>/SponsorPilot.git
cd SponsorPilot

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
```

### Environment Configuration (`.env.local`)
```env
# Crustdata REST API Key (Enables live company and person searches)
CRUSTDATA_API_KEY=your_crustdata_key_here

# Runtime LLM API Key (Google Gemini 3.5 Flash for autonomous planning & grounded drafting)
GEMINI_API_KEY=your_gemini_key_here

# Default target country
DEFAULT_COUNTRY=India
```

### LIVE vs. DEMO Mode Behavior
* **LIVE Mode (Currently Active):** When `CRUSTDATA_API_KEY` and `GEMINI_API_KEY` are provided in `.env.local`, SponsorPilot executes live REST calls to Crustdata (`/company/search`) and Gemini 3.5 Flash for planning and drafting.
* **Transparent DEMO Mode:** If keys are omitted or if `force_mode: "DEMO"` is sent in the payload, the app runs transparently in clearly labeled **DEMO Mode** using realistic fixtures (including Team Rakshak UAV, Unseen Solar-Car battery fabrication, and Campus Event scenarios). Synthetic results are explicitly labeled `DEMO` and never masqueraded as live data.

### Run Commands
```bash
# Start development server
npm run dev

# Run automated unit & scenario test suite
npm test

# Build production application
npm run build
```

---

## 5. Crustdata Endpoints & Evidence Provenance

* **Base URL:** `https://api.crustdata.com`
* **Version Header:** `x-api-version: 2025-11-01`
* **Auth:** `Authorization: Bearer <CRUSTDATA_API_KEY>`
* **Endpoints Used:**
  1. `POST /company/search`: Filtered discovery by `basic_info.description` (keyword matching) and `locations.country`.
  2. `POST /person/search`: Best-effort discovery of partnerships/university-relations roles. If no verifiable contact or email is returned, SponsorPilot strictly falls back to an account-level pitch labeled `Contact not verified` without inventing dummy emails.

---

## 6. Test Suite & Edge Cases

The test suite (`tests/sponsorpilot.test.ts`) tests 7 critical safety, qualification, and robustness scenarios:
1. **Irrelevant Company Rejection:** Verifies consumer retail chains (e.g. Croma, DCB Bank) are rejected with a specific capability mismatch reason without branding them as fraudulent.
2. **Missing Contact Fallback:** Verifies that when no qualifying contact is returned, an account-level pitch is generated and contact is honestly marked null/unverified without inventing email addresses.
3. **Duplicate Company Handling:** Verifies deduplication across domain and ID so that duplicate profiles yield a single record and no duplicate drafts.
4. **Team Facts Guard:** Injects unapproved assertions (e.g. *"We won the 2025 World Championship Gold Medal"*) and verifies they are blocked from outbound drafts.
5. **Unseen Second Brief:** Tests an unfamiliar solar-car brief needing battery fabrication, ensuring fresh search parameters and a battery-specific ask are generated rather than UAV boilerplate.
6. **Product Capability Contrast:** Tests two similar companies with different specialties (PCB vs sensors), verifying distinct ask strategies.
7. **Prompt Injection Resilience:** Tests that untrusted retrieved text containing prompt override delimiters is sanitized.

---

## 7. Submission Checklist & ContextCon Details

- [x] P0 End-to-end execution: Unseen brief -> research -> completed evidence-backed pitches
- [x] Real Crustdata integration verified live (`x-api-version: 2025-11-01`)
- [x] Gemini 3.5 Flash live query planning and grounded drafting verified
- [x] Transparent rejection of irrelevant candidates with capability mismatch reasons
- [x] Zero invented contacts or email addresses (account-level pitch fallback)
- [x] Team Facts Guard enforcing verified claims vs. unapproved user assertions
- [x] 1-Click copy of email drafts and complete JSON export
- [x] `.env.local` strictly ignored by git (zero secrets committed)
- [x] Automated test suite passing (7/7 tests) and Next.js production build passing
