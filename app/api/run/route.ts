import { NextRequest, NextResponse } from "next/server";
import { RunRequestSchema } from "@/lib/types";
import { runSponsorPilotAgent } from "@/lib/agent";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = RunRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const response = await runSponsorPilotAgent(parseResult.data);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("API /api/run error:", error);
    return NextResponse.json(
      {
        mode: "LIVE",
        status: "error",
        qualified: [],
        rejected: [],
        agent_trace: [
          {
            action: "SERVER_ERROR",
            outcome: error?.message || "Internal server exception",
          },
        ],
        errors: [error?.message || "Internal server error"],
      },
      { status: 500 }
    );
  }
}
