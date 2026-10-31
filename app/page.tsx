"use client";

import React, { useState, useEffect } from "react";
import {
  RunRequest,
  RunResponse,
  QualifiedLead,
  TeamFact,
  HealthResponse,
} from "@/lib/types";
import {
  Rocket,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Copy,
  Download,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Database,
  Cpu,
  RefreshCw,
  Search,
  Building,
  UserCheck,
  UserX,
  FileText,
  Zap,
} from "lucide-react";

const PRESET_RAKSHAK: RunRequest = {
  team_name: "Team Rakshak",
  team_description: "IIT Bombay student UAV engineering team competing in autonomous search-and-rescue",
  team_facts: [
    {
      text: "Designs indigenous UAV airframes and autonomous flight controllers at IIT Bombay",
      approved: true,
      origin: "team_approved",
    },
    {
      text: "Participates annually in international university aerial robotics challenges",
      approved: true,
      origin: "team_approved",
    },
  ],
  needs: ["PCB fabrication", "avionics components"],
  target_industries: ["electronics manufacturing", "aerospace"],
  country: "India",
  limit: 3,
};

const PRESET_SOLAR_CAR: RunRequest = {
  team_name: "IITB Solar Car Racing",
  team_description: "Student electric vehicle engineering team developing solar-powered endurance racing vehicles",
  team_facts: [
    {
      text: "Builds high-efficiency composite aerodynamic solar vehicles at IIT Bombay",
      approved: true,
      origin: "team_approved",
    },
  ],
  needs: ["battery pack fabrication", "lithium cells BMS"],
  target_industries: ["energy storage", "automotive batteries"],
  country: "India",
  limit: 3,
};

const PRESET_STUDENT_EVENT: RunRequest = {
  team_name: "Techfest IIT Bombay",
  team_description: "Asia's largest annual student science and technology festival organized at IIT Bombay",
  team_facts: [
    {
      text: "Hosts over 175,000 attendees and participants across 2,500+ colleges nationwide",
      approved: true,
      origin: "team_approved",
    },
  ],
  needs: ["technical workshop", "travel funding"],
  target_industries: ["software", "engineering education"],
  country: "India",
  limit: 3,
};

export default function Home() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [formData, setFormData] = useState<RunRequest>(PRESET_RAKSHAK);
  const [newNeed, setNewNeed] = useState("");
  const [newFactText, setNewFactText] = useState("");
  const [newFactApproved, setNewFactApproved] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RunResponse | null>(null);
  const [selectedLeadIndex, setSelectedLeadIndex] = useState(0);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  // Fetch health on mount
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data: HealthResponse) => setHealth(data))
      .catch((err) => console.error("Health check error:", err));
  }, []);

  const handleRun = async (overrideRequest?: RunRequest) => {
    setLoading(true);
    setCopyStatus(null);
    try {
      const payload = overrideRequest || formData;
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: RunResponse = await res.json();
      setResult(data);
      setSelectedLeadIndex(0);
    } catch (err) {
      console.error("Run error:", err);
      alert("Error contacting SponsorPilot backend.");
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (preset: RunRequest) => {
    setFormData(preset);
  };

  const addNeed = () => {
    if (newNeed.trim() && !formData.needs.includes(newNeed.trim())) {
      setFormData({
        ...formData,
        needs: [...formData.needs, newNeed.trim()],
      });
      setNewNeed("");
    }
  };

  const removeNeed = (idx: number) => {
    setFormData({
      ...formData,
      needs: formData.needs.filter((_, i) => i !== idx),
    });
  };

  const addFact = () => {
    if (newFactText.trim()) {
      setFormData({
        ...formData,
        team_facts: [
          ...formData.team_facts,
          {
            text: newFactText.trim(),
            approved: newFactApproved,
            origin: newFactApproved ? "team_approved" : "user_assertion",
          },
        ],
      });
      setNewFactText("");
    }
  };

  const removeFact = (idx: number) => {
    setFormData({
      ...formData,
      team_facts: formData.team_facts.filter((_, i) => i !== idx),
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(label);
    setTimeout(() => setCopyStatus(null), 2500);
  };

  const downloadJsonPackage = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SponsorPilot_${formData.team_name.replace(/[^a-z0-9]/gi, "_")}_Package.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white">SponsorPilot</h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  v2.0 ContextCon
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Autonomous Sponsorship Strategy & Outreach Strategist
              </p>
            </div>
          </div>

          {/* System & Mode Badges */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Crustdata:</span>
              <span className={health?.crustdata_configured ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
                {health?.crustdata_configured ? "Live API Connected" : "Local REST Adapter (DEMO)"}
              </span>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-400">Reasoning:</span>
              <span className={health?.llm_configured ? "text-blue-400 font-medium" : "text-slate-300 font-medium"}>
                {health?.llm_configured ? "Gemini 3.5 Active" : "Heuristic Guard"}
              </span>
            </div>

            <div className={`px-2.5 py-1.5 rounded-lg border font-mono font-semibold ${
              result?.mode === "LIVE" || health?.mode === "LIVE"
                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-400"
                : "bg-amber-950/50 border-amber-500/40 text-amber-300"
            }`}>
              MODE: {result?.mode || (health?.crustdata_configured ? "LIVE READY" : "DEMO READY")}
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid: 4 Views in 2-Column Responsive Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: View 1 (Brief Form) + View 2 (Trace & Decisions) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* VIEW 1: Campaign Brief */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 text-xs flex items-center justify-center font-bold">1</span>
                <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-300">Campaign Brief</h2>
              </div>
              <span className="text-xs text-slate-500">Student Team Need Input</span>
            </div>

            {/* Quick Demo Presets */}
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Select Verified Scenario Brief:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetSelect(PRESET_RAKSHAK)}
                  className={`text-left p-2 rounded-xl border text-xs transition ${
                    formData.team_name === "Team Rakshak"
                      ? "bg-blue-600/20 border-blue-500 text-blue-200"
                      : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  <div className="font-semibold flex items-center gap-1">
                    <Rocket className="w-3 h-3 text-blue-400" /> Team Rakshak
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">UAV PCB & Avionics</div>
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetSelect(PRESET_SOLAR_CAR)}
                  className={`text-left p-2 rounded-xl border text-xs transition ${
                    formData.team_name === "IITB Solar Car Racing"
                      ? "bg-amber-600/20 border-amber-500 text-amber-200"
                      : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  <div className="font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" /> Solar Car Team
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">Unseen Battery Need</div>
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetSelect(PRESET_STUDENT_EVENT)}
                  className={`text-left p-2 rounded-xl border text-xs transition ${
                    formData.team_name === "Techfest IIT Bombay"
                      ? "bg-purple-600/20 border-purple-500 text-purple-200"
                      : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  <div className="font-semibold flex items-center gap-1">
                    <Building className="w-3 h-3 text-purple-400" /> Campus Festival
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">Workshops & Grants</div>
                </button>
              </div>
            </div>

            {/* Team Info */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-medium text-slate-400">Team / Event Name</label>
                <input
                  type="text"
                  value={formData.team_name}
                  onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 text-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400">Team Description</label>
                <textarea
                  rows={2}
                  value={formData.team_description}
                  onChange={(e) => setFormData({ ...formData, team_description: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 text-white resize-none"
                />
              </div>

              {/* Specific Needs */}
              <div>
                <label className="text-xs font-medium text-slate-400 flex items-center justify-between">
                  <span>Explicit Material / Service Needs</span>
                  <span className="text-[10px] text-slate-500">e.g. PCB fabrication, battery cells</span>
                </label>
                <div className="flex flex-wrap gap-1.5 my-1.5">
                  {formData.needs.map((need, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs bg-blue-950/70 border border-blue-800/60 text-blue-300"
                    >
                      <span>{need}</span>
                      <button
                        type="button"
                        onClick={() => removeNeed(idx)}
                        className="hover:text-red-400 ml-1 text-slate-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add specific need..."
                    value={newNeed}
                    onChange={(e) => setNewNeed(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addNeed())}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addNeed}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg text-slate-200 transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Team Facts Guard Section */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    Team Facts Guard (Approved vs Unapproved)
                  </label>
                  <span className="text-[10px] text-slate-500">Prevents unverified win claims</span>
                </div>

                <div className="space-y-1.5 mb-2 max-h-36 overflow-y-auto pr-1">
                  {formData.team_facts.map((fact, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start justify-between p-2 rounded-lg text-xs border ${
                        fact.approved
                          ? "bg-slate-950/80 border-emerald-900/40 text-slate-300"
                          : "bg-amber-950/20 border-amber-800/40 text-amber-300"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {fact.approved ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <p>{fact.text}</p>
                          <span className="text-[10px] font-mono text-slate-500 uppercase">
                            {fact.origin} {fact.approved ? "• Approved for pitch" : "• BLOCKED from pitch"}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFact(idx)}
                        className="text-slate-500 hover:text-red-400 text-xs ml-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add fact with unapproved simulation button */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add team fact or assertion..."
                      value={newFactText}
                      onChange={(e) => setNewFactText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFact())}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                    <select
                      value={newFactApproved ? "approved" : "unapproved"}
                      onChange={(e) => setNewFactApproved(e.target.value === "approved")}
                      className="bg-slate-800 text-xs rounded-lg px-2 text-slate-200 border border-slate-700"
                    >
                      <option value="approved">Approved</option>
                      <option value="unapproved">User Claim</option>
                    </select>
                    <button
                      type="button"
                      onClick={addFact}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg text-slate-200 transition"
                    >
                      Add
                    </button>
                  </div>

                  {/* Benchmark Judge test button */}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        team_facts: [
                          ...formData.team_facts,
                          {
                            text: "We won the 2025 World Championship 1st place gold medal",
                            approved: false,
                            origin: "user_assertion",
                          },
                        ],
                      });
                    }}
                    className="w-full text-left text-[11px] text-amber-400/90 hover:text-amber-300 bg-amber-950/20 hover:bg-amber-950/40 border border-amber-900/50 rounded-lg px-2.5 py-1.5 transition flex items-center justify-between"
                  >
                    <span>🧪 QA Test: Inject unapproved "won world championship" claim</span>
                    <span className="text-[10px] underline">Click to test guard</span>
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="button"
                onClick={() => handleRun()}
                disabled={loading}
                className="w-full mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/20 disabled:opacity-50 transition"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing Sponsorship Strategist...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Run Sponsorship Strategist (Crustdata Search & Match)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* VIEW 2: Agent Decisions & Audit Trace */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 text-xs flex items-center justify-center font-bold">2</span>
                <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-300">Agent Decision Loop & Audit Trace</h2>
              </div>
              {result && (
                <span className="text-[11px] font-mono text-emerald-400">
                  {result.execution_metrics?.wall_clock_ms}ms runtime
                </span>
              )}
            </div>

            {/* Decisions State Trace */}
            {result?.agent_trace && result.agent_trace.length > 0 ? (
              <div className="space-y-2">
                <div className="max-h-56 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
                  {result.agent_trace.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-start space-x-2.5"
                    >
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-indigo-300 border border-slate-700 uppercase flex-shrink-0">
                        {item.action}
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed break-words">
                        {item.outcome}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Visible Rejections Showcase (Core requirement) */}
                {result.rejected && result.rejected.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1.5 text-xs font-semibold text-rose-400">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Visible Rejection Showcase ({result.rejected.length})</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Filtered by capability matching</span>
                    </div>

                    <div className="space-y-2">
                      {result.rejected.map((rej, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-900/50 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-rose-300">{rej.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-400 uppercase font-bold">
                              REJECTED
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300">{rej.reason}</p>
                          {rej.evidence && rej.evidence[0] && (
                            <a
                              href={rej.evidence[0].source_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:underline"
                            >
                              <span>Source: {rej.evidence[0].source_url}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                Click &quot;Run Sponsorship Strategist&quot; to view live decision trace and candidate qualification.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: View 3 (Qualified Leads & Strategy) + View 4 (Unique Drafts & Export) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* VIEW 3: Qualified Leads with Source Links */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600/20 text-emerald-400 text-xs flex items-center justify-center font-bold">3</span>
                <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-300">Qualified Lead Packages</h2>
              </div>
              {result && (
                <span className="text-xs text-emerald-400 font-medium">
                  {result.qualified.length} evidence-backed targets
                </span>
              )}
            </div>

            {result?.qualified && result.qualified.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {result.qualified.map((lead, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedLeadIndex(idx)}
                    className={`text-left p-3 rounded-xl border text-xs transition space-y-2 ${
                      selectedLeadIndex === idx
                        ? "bg-slate-800 border-blue-500 ring-1 ring-blue-500/50 shadow-md"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-white text-sm">{lead.company.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800/80 text-emerald-300 uppercase font-semibold">
                        {lead.ask.type}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {lead.company.description}
                    </p>

                    {/* Contact status badge */}
                    <div className="flex items-center gap-1.5 text-[11px]">
                      {lead.contact?.verified ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          <UserCheck className="w-3 h-3" /> {lead.contact.name}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
                          <UserX className="w-3 h-3 text-slate-500" /> Contact Unverified
                        </span>
                      )}
                    </div>

                    {/* Matched need tags */}
                    <div className="flex flex-wrap gap-1">
                      {lead.need_match.map((n, i) => (
                        <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-900/60">
                          {n}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                Qualified sponsors will be scored, verified against team needs, and displayed here.
              </div>
            )}
          </div>

          {/* VIEW 4: Grounded Email Draft Preview & JSON Export */}
          {result?.qualified && result.qualified.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600/20 text-purple-400 text-xs flex items-center justify-center font-bold">4</span>
                  <div>
                    <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-300">
                      Grounded Pitch Draft Preview
                    </h2>
                    <span className="text-[11px] text-slate-400">
                      Target: {result.qualified[selectedLeadIndex]?.company.name}
                    </span>
                  </div>
                </div>

                {/* Export & Copy Actions */}
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        `Subject: ${result.qualified[selectedLeadIndex].email_draft.subject}\n\n${result.qualified[selectedLeadIndex].email_draft.body}`,
                        "draft"
                      )
                    }
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 transition flex items-center justify-center space-x-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copyStatus === "draft" ? "Copied!" : "Copy Draft"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={downloadJsonPackage}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-medium text-white transition flex items-center justify-center space-x-1.5 shadow-md shadow-blue-500/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Package (JSON)</span>
                  </button>
                </div>
              </div>

              {/* Pitch Deep Dive */}
              {result.qualified[selectedLeadIndex] && (
                <div className="space-y-4 text-xs">
                  {/* Strategy & Ask Bar */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wide">
                        Justified Ask Strategy: {result.qualified[selectedLeadIndex].ask.type}
                      </span>
                      <a
                        href={`https://${result.qualified[selectedLeadIndex].company.domain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-blue-400 flex items-center gap-1 text-[11px]"
                      >
                        <span>{result.qualified[selectedLeadIndex].company.domain}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-slate-200 font-medium">
                      {result.qualified[selectedLeadIndex].ask.specific_request}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      <strong className="text-slate-300">Why this company:</strong>{" "}
                      {result.qualified[selectedLeadIndex].ask.reason}
                    </p>
                  </div>

                  {/* Safety Policy Notice */}
                  <div className="px-3 py-2 rounded-lg bg-amber-950/30 border border-amber-900/60 flex items-center justify-between text-[11px] text-amber-300">
                    <span className="flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <strong>Safety Guard:</strong> Local draft only. No emails dispatched to real persons.
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-900/50 uppercase font-bold">
                      NOT SENT
                    </span>
                  </div>

                  {/* Email Draft Box */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 font-sans">
                    <div className="border-b border-slate-800/80 pb-2">
                      <span className="text-slate-500 text-[11px] block">Subject:</span>
                      <span className="font-semibold text-slate-100 text-xs">
                        {result.qualified[selectedLeadIndex].email_draft.subject}
                      </span>
                    </div>

                    <div className="whitespace-pre-wrap text-slate-300 leading-relaxed text-xs">
                      {result.qualified[selectedLeadIndex].email_draft.body}
                    </div>
                  </div>

                  {/* Provenance & Sourced Evidence */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Source Evidence & Provenance
                    </span>
                    <div className="space-y-1.5">
                      {result.qualified[selectedLeadIndex].evidence.map((ev, i) => (
                        <div key={i} className="flex items-start justify-between text-[11px]">
                          <span className="text-slate-300">• {ev.claim}</span>
                          <span className="text-slate-500 font-mono text-[10px] ml-2 flex-shrink-0">
                            [{ev.origin}]
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Disclosed Uncertainties */}
                    {result.qualified[selectedLeadIndex].uncertainties.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/60 text-[11px] text-amber-400/90 space-y-1">
                        <span className="font-medium text-amber-300 block">Disclosed Uncertainties:</span>
                        {result.qualified[selectedLeadIndex].uncertainties.map((unc, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <span>⚠</span>
                            <span>{unc}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          SponsorPilot V2 — Autonomous Sponsorship Campaign Preparation Prototype • ContextCon 03 / IIT Bombay
        </p>
      </footer>
    </main>
  );
}
