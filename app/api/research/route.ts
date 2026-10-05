import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ComparisonCell = {
  option: string;
  priority: string;
  analysis: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { options, priorities, context } = body;

    // Validate options
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

    // Try live AI research first
    try {
      const prompt = `
You are VERDICT, an AI comparison and decision-making engine.

Compare these options:

${cleanOptions.map((option, i) => `${i + 1}. ${option}`).join("\n")}

The user's priorities are:

${cleanPriorities.map((priority) => `- ${priority}`).join("\n")}

Additional context:
${cleanContext}

Research the options using current web information.

Determine:
1. The best option for this user.
2. Why it wins.
3. How every option performs against every priority.
4. Important trade-offs.
5. Useful sources.

Return ONLY valid JSON in exactly this structure:

{
  "mode": "live",
  "recommendation": "winning option",
  "recommendationReason": "clear explanation",
  "options": [],
  "priorities": [],
  "context": "",
  "comparison": [
    {
      "option": "",
      "priority": "",
      "analysis": ""
    }
  ],
  "tradeoffs": [],
  "sources": []
}

Important:
- Do not invent facts.
- Prefer recent and authoritative sources.
- Every option must be represented for every priority.
`;

      const response = await openai.responses.create({
        model: "gpt-6-luna",
        tools: [{ type: "web_search" }],
        input: prompt,
      });

      const text = response.output_text;

      const result = JSON.parse(text);

      return NextResponse.json({
        result: JSON.stringify(result),
      });
    } catch (apiError) {
      // API failed — use development fallback
      console.error("Live research unavailable:", apiError);

      const comparison: ComparisonCell[] = [];

      for (const priority of cleanPriorities) {
        for (const option of cleanOptions) {
          comparison.push({
            option,
            priority,
            analysis:
              "Live web research is currently unavailable. This comparison will be updated when the research engine is available.",
          });
        }
      }

      const fallbackResult = {
        mode: "fallback",
        recommendation: cleanOptions[0],
        recommendationReason:
          "Live AI research is currently unavailable, so VERDICT is showing a temporary development result. The recommendation will be recalculated using web research when the research engine is available.",
        options: cleanOptions,
        priorities: cleanPriorities,
        context: cleanContext,
        comparison,
        tradeoffs: [
          "A live comparison requires current web research.",
          "The options may differ significantly depending on your priorities.",
          "This temporary result should not be treated as a researched recommendation.",
        ],
        sources: [],
      };

      return NextResponse.json({
        result: JSON.stringify(fallbackResult),
      });
    }
  } catch (error) {
    console.error("VERDICT research error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while processing your comparison.",
      },
      { status: 500 }
    );
  }
}