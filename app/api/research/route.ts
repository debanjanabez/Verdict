import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ComparisonCell = {
  option: string;
  priority: string;
  score: number;
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

    // ============================================================
    // LIVE AI RESEARCH
    // ============================================================

    try {
      const prompt = `
You are VERDICT, an AI comparison and decision-making engine.

Compare these options:

${cleanOptions.map((option, i) => `${i + 1}. ${option}`).join("\n")}

The user's priorities are:

${cleanPriorities.map((priority) => `- ${priority}`).join("\n")}

Additional context:
${cleanContext}

Use web research to investigate the options.

Your job is to:

1. Determine which option is the best overall choice for THIS user.
2. Explain clearly why it wins.
3. Compare EVERY option against EVERY priority.
4. Identify important trade-offs.
5. Use current, relevant and authoritative information.
6. Base factual claims on information found through web research.
7. For every option and every priority, provide:
- a score from 0 to 100
- a concise explanation of the score

The score must reflect how well that option satisfies that specific priority.
Do not give every option the same score.

Return ONLY valid JSON in exactly this structure:

{
  "mode": "live",
  "recommendation": "winning option",
  "recommendationReason": "clear explanation of why it wins",
  "options": [],
  "priorities": [],
  "context": "",
  "comparison": [
    {
  "option": "",
  "priority": "",
  "score": 0,
  "analysis": ""
}
  ],
  "tradeoffs": []
}

Important:
- Do not invent facts.
- Prefer official websites, documentation, reputable publications and reliable review sources.
- Prefer recent information when the information can change over time.
- Every option must be represented for every priority.
- Keep each comparison analysis concise but specific.
- Do NOT generate or guess source URLs.
- Actual web-search citations will be attached separately by VERDICT.
`;

      const response = await openai.responses.create({
        model: "gpt-6-luna",
        tools: [{ type: "web_search" }],
        input: prompt,
      });

      const text = response.output_text;

      const result = JSON.parse(text);
      
      // Validate the AI response before using its scores.
      if (
        !result ||
        !Array.isArray(result.comparison) ||
        !Array.isArray(result.options) ||
        !Array.isArray(result.priorities)
      ) {
        throw new Error("Invalid research response structure");
      }

      // Require exactly one valid score for each option-priority pair.
      const expectedCount =
        cleanOptions.length * cleanPriorities.length;

      if (result.comparison.length !== expectedCount) {
        throw new Error("Research response has missing comparisons");
      }

      const seenPairs = new Set<string>();

      for (const cell of result.comparison) {
        if (
          !cell ||
          typeof cell.option !== "string" ||
          typeof cell.priority !== "string" ||
          typeof cell.score !== "number" ||
          !Number.isFinite(cell.score) ||
          cell.score < 0 ||
          cell.score > 100 ||
          typeof cell.analysis !== "string" ||
          !cleanOptions.includes(cell.option) ||
          !cleanPriorities.includes(cell.priority)
        ) {
          throw new Error("Research response contains invalid scores");
        }

        const pair = JSON.stringify([cell.option, cell.priority]);

        if (seenPairs.has(pair)) {
          throw new Error("Research response contains duplicate comparisons");
        }

        seenPairs.add(pair);
        cell.score = Math.round(cell.score);
      }

      // Keep the recommendation consistent with the scores.
      const totals = cleanOptions.map((option) => {
        const cells = result.comparison.filter(
          (cell: ComparisonCell) => cell.option === option
        );

        return {
          option,
          score:
            cells.reduce(
              (sum: number, cell: ComparisonCell) => sum + cell.score,
              0
            ) / cleanPriorities.length,
        };
      });

      totals.sort((a, b) => b.score - a.score);

      result.recommendation = totals[0].option;


      // ============================================================
      // EXTRACT ACTUAL WEB-SEARCH CITATIONS
      // ============================================================

      const sources: string[] = [];

      for (const outputItem of response.output) {
        if (!("content" in outputItem) || !outputItem.content) {
          continue;
        }

        for (const contentItem of outputItem.content) {
          if (!("annotations" in contentItem) || !contentItem.annotations) {
            continue;
          }

          for (const annotation of contentItem.annotations) {
            if (
              "url" in annotation &&
              typeof annotation.url === "string" &&
              annotation.url.startsWith("http")
            ) {
              if (!sources.includes(annotation.url)) {
                sources.push(annotation.url);
              }
            }
          }
        }
      }

      // Attach actual URLs extracted from the web-search response.
      result.sources = sources;

      return NextResponse.json({
        result: JSON.stringify(result),
      });
    } catch (apiError) {
      console.error("Live research unavailable:", apiError);

      return NextResponse.json(
        {
          error:
            "Live web research is temporarily unavailable. No scores were generated. Please try again later.",
        },
        { status: 503 }
      );
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
