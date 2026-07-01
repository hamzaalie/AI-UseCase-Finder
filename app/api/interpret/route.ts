import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { TASKS } from "@/data/tasks";
import { INDUSTRIES } from "@/data/industries";
import { keywordInterpret, InterpretResult } from "@/lib/interpret";
import { Ratings } from "@/lib/match";

// The Anthropic SDK needs the Node runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TASK_IDS = TASKS.map((t) => t.id);
const VALID_TASK = new Set<string>(TASK_IDS);
const VALID_INDUSTRY = new Set(INDUSTRIES.map((i) => i.id));
const MAX_LEN = 2000;

// Structured output: the model may ONLY choose from our fixed task ids.
const PLAN_SCHEMA = {
  type: "object",
  properties: {
    ratings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", enum: TASK_IDS },
          severity: { type: "integer", enum: [1, 2, 3] },
        },
        required: ["id", "severity"],
        additionalProperties: false,
      },
    },
    message: { type: "string" },
  },
  required: ["ratings", "message"],
  additionalProperties: false,
} as const;

interface ParsedPlan {
  ratings: { id: string; severity: number }[];
  message: string;
}

function taskListForPrompt(): string {
  return TASKS.map((t) => `- ${t.id}: ${t.label} (${t.note})`).join("\n");
}

export async function POST(req: NextRequest) {
  let body: { industry?: string; description?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const description = (body.description ?? "").trim().slice(0, MAX_LEN);
  const industryId = body.industry && VALID_INDUSTRY.has(body.industry) ? body.industry : "other";
  const industryLabel = INDUSTRIES.find((i) => i.id === industryId)?.label ?? "small business";

  if (description.length < 3) {
    return NextResponse.json({ ok: false, error: "Please describe what's slowing you down." }, { status: 400 });
  }

  // No key → shallow keyword fallback (still useful, still free).
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ ok: true, ...keywordInterpret(description) });
  }

  try {
    const client = new Anthropic();
    const system = [
      "You help a small-business owner map what they wrote about their problems onto a FIXED list of pain points.",
      "Rules:",
      "1. Choose ONLY from the pain-point ids provided. Never invent ids or solutions.",
      "2. For each pain the description clearly implies, assign a severity: 1 = a bit, 2 = hurts a lot, 3 = a major drain. Pick 2–5 of the most relevant; don't force-fit weak matches.",
      "3. Write `message`: 2–3 warm, plain-language sentences (first person, as Hamza from Netsol AI) reflecting back what you heard and where the biggest lever is. Be honest. NEVER invent numbers, percentages, or money figures.",
      "",
      `The owner's industry: ${industryLabel}.`,
      "",
      "Pain-point ids you may use:",
      taskListForPrompt(),
    ].join("\n");

    const res = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: `Here's what they said:\n\n"""${description}"""` }],
      output_config: { format: { type: "json_schema", schema: PLAN_SCHEMA } },
    } as Anthropic.MessageCreateParamsNonStreaming);

    const textBlock = res.content.find((b): b is Anthropic.TextBlock => b.type === "text");
    let parsed: ParsedPlan | null = null;
    if (textBlock) {
      try {
        parsed = JSON.parse(textBlock.text) as ParsedPlan;
      } catch {
        parsed = null;
      }
    }
    if (!parsed || !Array.isArray(parsed.ratings)) {
      return NextResponse.json({ ok: true, ...keywordInterpret(description) });
    }

    const ratings: Ratings = {};
    for (const r of parsed.ratings) {
      const sev = Math.max(1, Math.min(3, Math.round(Number(r?.severity))));
      if (r && VALID_TASK.has(r.id) && sev >= 1) ratings[r.id] = sev;
    }

    const result: InterpretResult = {
      ratings,
      message: parsed.message?.trim() || keywordInterpret(description).message,
      source: "ai",
    };
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[interpret] AI error, falling back to keywords:", err);
    return NextResponse.json({ ok: true, ...keywordInterpret(description) });
  }
}
