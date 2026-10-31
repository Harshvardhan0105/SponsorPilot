import { NextResponse } from "next/server";
import { HealthResponse } from "@/lib/types";

export async function GET() {
  const crustdataConfigured = Boolean(process.env.CRUSTDATA_API_KEY);
  const llmConfigured = Boolean(process.env.GEMINI_API_KEY);

  let mode: "LIVE" | "DEMO" | "HYBRID" = "DEMO";
  if (crustdataConfigured && llmConfigured) {
    mode = "LIVE";
  } else if (crustdataConfigured || llmConfigured) {
    mode = "HYBRID";
  }

  const response: HealthResponse = {
    status: "healthy",
    crustdata_configured: crustdataConfigured,
    llm_configured: llmConfigured,
    mode,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
