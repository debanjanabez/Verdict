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
      // ============================================================
      // FALLBACK MODE
      // ============================================================

      console.error("Live research unavailable:", apiError);

      const priorityScores: Record<string, number[]> = {};

      for (const priority of cleanPriorities) {
        const normalized = priority.toLowerCase();

        priorityScores[priority] = cleanOptions.map((option, index) => {
          const text = option.toLowerCase();

          let score = 50;

          if (normalized.includes("price")) {
            if (
              text.includes("budget") ||
              text.includes("cheap") ||
              text.includes("affordable") ||
              text.includes("value")
            ) {
              score += 15;
            }

            score -= index * 2;
          }

          if (normalized.includes("performance")) {
            if (
              text.includes("pro") ||
              text.includes("ultra") ||
              text.includes("max") ||
              text.includes("performance")
            ) {
              score += 15;
            }
          }

          if (normalized.includes("battery")) {
            if (
              text.includes("ultra") ||
              text.includes("max") ||
              text.includes("battery")
            ) {
              score += 15;
            }
          }

          if (normalized.includes("quality")) {
            if (
              text.includes("pro") ||
              text.includes("premium") ||
              text.includes("plus") ||
              text.includes("ultra")
            ) {
              score += 15;
            }
          }

          if (normalized.includes("features")) {
            if (
              text.includes("pro") ||
              text.includes("plus") ||
              text.includes("ultra") ||
              text.includes("max")
            ) {
              score += 15;
            }
          }

          if (normalized.includes("portability")) {
            if (
              text.includes("mini") ||
              text.includes("air") ||
              text.includes("lite") ||
              text.includes("compact")
            ) {
              score += 15;
            }
          }

          if (normalized.includes("durability")) {
            if (
              text.includes("pro") ||
              text.includes("ultra") ||
              text.includes("rugged")
            ) {
              score += 15;
            }
          }

          if (normalized.includes("reviews")) {
            if (
              text.includes("pro") ||
              text.includes("premium") ||
              text.includes("popular")
            ) {
              score += 10;
            }
          }

          return Math.max(0, Math.min(100, score));
        });
      }

      // Calculate overall score
      const overallScores = cleanOptions.map((option, index) => {
        const scores = cleanPriorities.map(
          (priority) => priorityScores[priority][index]
        );

        const total =
          scores.reduce((sum, score) => sum + score, 0) / scores.length;

        return {
          option,
          score: total,
        };
      });

      overallScores.sort((a, b) => b.score - a.score);

      const fallbackWinner = overallScores[0].option;

      // Build comparison data
      const comparison: ComparisonCell[] = [];

      for (const priority of cleanPriorities) {
        const scores = priorityScores[priority];

        cleanOptions.forEach((option, index) => {
          comparison.push({
  option,
  priority,
  score: scores[index],
  analysis:
    `${option} receives a development score of ${scores[index]}/100 for ${priority}. ` +
    `This is a temporary heuristic and not live web research.`,
});
        });
      }

      const fallbackResult = {
        mode: "fallback",
        recommendation: fallbackWinner,
        recommendationReason:
          `${fallbackWinner} currently ranks highest based on your selected priorities: ` +
          `${cleanPriorities.join(", ")}. ` +
          `This is a development fallback because live web research is unavailable.`,
        options: cleanOptions,
        priorities: cleanPriorities,
        context: cleanContext,
        comparison,
        tradeoffs: [
          "This result uses simple development heuristics rather than live research.",
          "Changing your priorities can change the recommended option.",
          "A live research result will replace this fallback when the research engine is available.",
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