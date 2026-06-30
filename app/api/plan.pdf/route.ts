import { NextRequest } from "next/server";
import { getMatches } from "@/lib/match";
import { decodeState } from "@/lib/share";
import { renderPlanPdf } from "@/lib/pdf";

// PDF rendering needs the Node runtime (not Edge).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { industry, ratings } = decodeState(req.nextUrl.searchParams);

  if (!industry || Object.keys(ratings).length === 0) {
    return new Response(
      "Couldn't build a PDF — the plan link is missing its industry/tasks. Generate a fresh plan and try again.",
      { status: 400, headers: { "Content-Type": "text/plain" } }
    );
  }

  const result = getMatches(industry, ratings);
  if (result.ordered.length === 0) {
    return new Response("No use cases matched this plan.", {
      status: 404,
      headers: { "Content-Type": "text/plain" },
    });
  }

  try {
    const pdf = await renderPlanPdf(result, req.nextUrl.toString());
    const filename = `AI-Plan-${industry}.pdf`;
    return new Response(pdf as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("[plan.pdf] render error:", err);
    return new Response("Sorry — we couldn't generate the PDF just now.", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
