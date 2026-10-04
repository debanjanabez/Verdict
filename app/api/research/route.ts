import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { options, priorities, context } = body;

    if (
      !Array.isArray(options) ||
      options.length < 2 ||
      options.length > 8 ||
      options.some(
        (option: unknown) =>
          typeof option !== "string" || option.trim().length === 0
      )
    ) {
      return NextResponse.json(
        { error: "Please provide between 2 and 8 valid options." },
        { status: 400 }
      );
    }

    const cleanOptions = options.map((option: string) => option.trim());

    const cleanPriorities =
      Array.isArray(priorities) && priorities.length > 0
        ? priorities
            .filter((priority: unknown) => typeof priority === "string")
            .map((priority: string) => priority.trim())
            .filter(Boolean)
        : ["Overall value"];

    const cleanContext =
      typeof context === "string" && context.trim()
        ? context.trim()
        : "No additional context provided.";

    const prompt = `
You are VERDICT, an AI comparison and decision-making engine.

Compare these options:

${cleanOptions.map((option, i) => `${i + 1}. ${option}`).join("\n")}

The user's priorities are:

${cleanPriorities.map((priority) => `- ${priority}`).join("\n")}

Additional context from the user:
${cleanContext}

Research the options using current web information.

Your job is to:
1. Determine which option is the best overall choice for THIS user.
2. Explain why that option wins.
3. Compare every option against every priority.
4. Identify important trade-offs.
5. Provide the most useful sources used for the comparison.

Return ONLY valid JSON in exactly this structure:

{
  "mode": "live",
  "recommendation": "winning option",
  "recommendationReason": "clear explanation of why it wins",
  "options": ["option 1", "option 2"],
  "priorities": ["priority 1", "priority 2"],
  "context": "user context",
  "comparison": [
    {
      "option": "option 1",
      "priority": "priority 1",
      "analysis": "specific researched analysis"
    }
  ],
  "tradeoffs": [
    "important trade-off 1",
    "important trade-off 2"
  ],
  "sources": [
    "https://example.com/source"
  ]
}

Important:
- Do not invent facts.
- Prefer recent and authoritative sources.
- Be concise but useful.
- Every option must be represented for every priority.
`;

    const response = await openai.responses.create({
      model: "gpt-6-luna",
      tools: [{ type: "web_search" }],
      input: prompt,
    });

    const text = response.output_text;

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      console.error("Invalid JSON from research model:", text);

      return NextResponse.json(
        {
          error: "The research engine returned an invalid result.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      result: JSON.stringify(result),
    });
  } catch (error) {
    console.error("VERDICT research error:", error);

    return NextResponse.json(
      {
        error:
          "Research could not be completed. Please check your API credits and try again.",
      },
      { status: 500 }
    );
  }
}