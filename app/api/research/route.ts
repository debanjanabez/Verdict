import { NextResponse } from "next/server";

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

    // Clean incoming data
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

    // Create structured comparison cells.
    // These are placeholders until live research is connected.
    const comparison: ComparisonCell[] = [];

    for (const priority of cleanPriorities) {
      for (const option of cleanOptions) {
        comparison.push({
          option,
          priority,
          analysis: "Awaiting research",
        });
      }
    }

    // Demo recommendation.
    // The live research engine will determine this later.
    const recommendation = cleanOptions[0];

    const result = {
      mode: "demo",
      recommendation,
      recommendationReason:
        "This is a placeholder recommendation. Live research will determine the recommendation using current information and your selected priorities.",
      options: cleanOptions,
      priorities: cleanPriorities,
      context: cleanContext,
      comparison,
      tradeoffs: [
        "Different options may perform differently depending on your priorities.",
        "Price, performance, features, durability, and long-term value may involve trade-offs.",
        "The live research engine will identify these trade-offs using current evidence.",
      ],
      sources: [],
    };

    return NextResponse.json({
      result: JSON.stringify(result),
    });
  } catch (error) {
    console.error("VERDICT research error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while researching your comparison.",
      },
      { status: 500 }
    );
  }
}