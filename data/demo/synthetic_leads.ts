import { RunResponse } from "@/lib/types";

export const DEMO_TEAM_RAKSHAK_RESULT: RunResponse = {
  mode: "DEMO",
  status: "completed_with_warnings",
  qualified: [
    {
      company: {
        name: "Sierra Circuits",
        domain: "protoexpress.com",
        id: "crust_comp_sierra_01",
        description: "Specialized quick-turn high-density PCB prototyping and PCB assembly manufacturer.",
        industry: "Electronics Manufacturing",
        location: "Bengaluru, India / San Jose, USA",
      },
      need_match: ["PCB fabrication"],
      ask: {
        type: "in_kind",
        specific_request:
          "Prototyping sponsorship for 5-10 small-batch multilayer PCBs and assembly assistance for Team Rakshak's airborne avionics modules.",
        reason:
          "Sierra Circuits possesses specialized PCB manufacturing and surface-mount assembly infrastructure, directly meeting Team Rakshak's hardware turnaround need.",
      },
      contact: {
        name: "Priya Nair",
        title: "University Relations & Technical Community Manager",
        email: null,
        linkedin_url: "https://linkedin.com/in/priya-nair-demo",
        verified: false,
        role_family: "University Relations / Academic Partnerships",
      },
      email_draft: {
        subject: "Partnership Proposal: Sierra Circuits PCB Prototyping Support for Team Rakshak UAV",
        body: `Hi Priya,

I am writing from Team Rakshak, the student UAV engineering team at IIT Bombay. We design autonomous unmanned aerial vehicles for emergency payload delivery and search-and-rescue competitions.

We follow Sierra Circuits' quick-turn PCB fabrication and assembly precision. As we finalize our latest avionics stack, we are seeking an in-kind prototyping partnership for our custom 6-layer flight-controller boards (5-10 panels).

In return, we would feature Sierra Circuits prominently on our airframe livery, technical whitepapers, and competition presentations, highlighting your fabrication capabilities to the student engineering community.

Would you or someone on the academic relations team be open to a 10-minute briefing next week to see our design specs?

Best regards,
Sponsorship Coordinator
Team Rakshak, IIT Bombay`,
      },
      evidence: [
        {
          claim: "Verified capabilities in HDI, multi-layer rigid-flex PCB fabrication and quick-turn SMT assembly.",
          source_url: "https://protoexpress.com/capabilities",
          origin: "crustdata",
        },
      ],
      uncertainties: [
        "Direct corporate email not publicly verified; recommended role family: Academic / Technical Relations.",
      ],
    },
    {
      company: {
        name: "VectorNav Technologies",
        domain: "vectornav.com",
        id: "crust_comp_vectornav_02",
        description: "Manufacturer of high-performance inertial navigation systems (INS) and industrial GPS/GNSS sensors.",
        industry: "Aerospace & Defense Electronics",
        location: "Global / India Distributor Network",
      },
      need_match: ["avionics components"],
      ask: {
        type: "discount",
        specific_request:
          "Evaluation units or student-team discount on VN-100 / VN-200 ruggedized inertial navigation sensors.",
        reason:
          "VectorNav supplies aerospace-grade MEMS IMU/INS solutions, eliminating orientation drift in high-vibration autonomous fixed-wing flight.",
      },
      contact: null,
      email_draft: {
        subject: "Student Sponsorship: Inertial Sensor Evaluation for Team Rakshak Autonomous UAV",
        body: `Hello VectorNav Team,

Our engineering team at IIT Bombay (Team Rakshak) develops autonomous aerial platforms for challenging disaster response missions.

We have studied VectorNav's tactical-grade MEMS inertial navigation systems. To overcome drift in high-vibration flight dynamics, we are requesting consideration for a student evaluation unit or academic discount on the VN-100 series for our 2026 airframe.

We would be glad to share our flight vibration telemetry data and publish a technical case study detailing VectorNav's real-world performance under aggressive maneuvers.

Could you kindly direct this request to your University Sponsorship or Regional Applications Engineering team?

Sincerely,
Team Rakshak Avionics Division
IIT Bombay`,
      },
      evidence: [
        {
          claim: "Industry-standard MEMS inertial sensor solutions with proven UAV/aerospace applications.",
          source_url: "https://vectornav.com/products",
          origin: "crustdata",
        },
      ],
      uncertainties: ["Contact not verified; account-level outreach drafted."],
    },
    {
      company: {
        name: "Centum Electronics",
        domain: "centumelectronics.com",
        id: "crust_comp_centum_03",
        description: "Leading Indian aerospace and defense electronics design, prototyping, and subsystem integration firm.",
        industry: "Aerospace / Electronics Manufacturing",
        location: "Bengaluru, India",
      },
      need_match: ["PCB fabrication", "avionics components"],
      ask: {
        type: "in_kind",
        specific_request:
          "Engineering review mentorship and access to environmental testing facilities for UAV avionics enclosures.",
        reason:
          "Centum Electronics is an established domestic leader in defense and aerospace electronics manufacturing with deep testing and fabrication infrastructure.",
      },
      contact: {
        name: "Rajesh Sharma",
        title: "Director of Strategic Partnerships & CSR",
        email: null,
        linkedin_url: "https://linkedin.com/in/rajesh-sharma-demo",
        verified: false,
        role_family: "Corporate Social Responsibility / Strategic Partnerships",
      },
      email_draft: {
        subject: "IIT Bombay Team Rakshak: In-Kind Avionics Fabrication Partnership",
        body: `Dear Mr. Sharma,

Greetings from Team Rakshak at IIT Bombay. Our collegiate team engineers indigenous autonomous UAV systems for disaster mitigation and remote aerial search.

Given Centum Electronics' pioneering contribution to Indian aerospace and mission-critical electronics, we are seeking an in-kind engineering partnership for environmental vibration validation and avionics prototyping.

Our team provides an active platform to showcase domestic aerospace engineering excellence to hundreds of upcoming engineers and competition audiences nationwide.

We would welcome the opportunity to present our system architecture to your technical community team at your convenience.

Warm regards,
Team Rakshak Partnerships
IIT Bombay`,
      },
      evidence: [
        {
          claim: "Extensive manufacturing capabilities in mission-critical electronics and space-grade modules.",
          source_url: "https://centumelectronics.com/aerospace",
          origin: "crustdata",
        },
      ],
      uncertainties: [
        "Email address not confirmed; title derived from public corporate directory.",
      ],
    },
  ],
  rejected: [
    {
      name: "Croma (Infiniti Retail)",
      reason:
        "Capability mismatch: Operates strictly as a multi-brand consumer electronics retail chain with zero in-house PCB fabrication, surface-mount manufacturing, or industrial component supply services.",
      evidence: [
        {
          claim: "Consumer retail store network for televisions, laptops, and home appliances.",
          source_url: "https://croma.com",
        },
      ],
      domain: "croma.com",
    },
  ],
  agent_trace: [
    {
      action: "INTAKE",
      outcome: "Validated brief for Team Rakshak (2 verified needs, 1 approved fact, 0 unapproved claims)",
    },
    {
      action: "PLAN",
      outcome: "Generated query: 'PCB fabrication assembly' AND 'aerospace electronics sensors' in India",
    },
    {
      action: "DISCOVER",
      outcome: "Retrieved 5 raw company profiles from Crustdata index",
    },
    {
      action: "QUALIFY",
      outcome: "Screened candidates against technical capability requirements",
    },
    {
      action: "REJECT",
      outcome: "REJECTED 'Croma (Infiniti Retail)': consumer retail store without PCB manufacturing capability",
    },
    {
      action: "CONTACT_SEARCH",
      outcome: "Searched for partnerships/university relations roles; zero private emails guessed (strict honesty rule)",
    },
    {
      action: "SPONSORSHIP_ASK",
      outcome: "Mapped Sierra Circuits -> in-kind PCB; VectorNav -> discount sensors; Centum -> manufacturing review",
    },
    {
      action: "DRAFT_AND_VERIFY",
      outcome: "Constructed 3 differentiated pitches grounded in confirmed facts; marked NOT SENT",
    },
  ],
  errors: [],
  execution_metrics: {
    total_candidates_found: 5,
    qualified_count: 3,
    rejected_count: 1,
    wall_clock_ms: 1420,
    has_llm_reasoning: false,
  },
};
