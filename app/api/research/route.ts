import { NextResponse } from "next/server";

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
        : ["Overall value"];

    const cleanContext =
      typeof context === "string" && context.trim()
        ? context.trim()
        : "No additional context provided.";

    const optionList = cleanOptions
      .map(
        (option: string, index: number) =>
          `OPTION ${String(index + 1).padStart(2, "0")}\n${option}`
      )
      .join("\n\n");

    const priorityList = cleanPriorities
      .map((priority: string) => `• ${priority}`)
      .join("\n");

    const result = `
EXECUTIVE SUMMARY

VERDICT has structured your comparison around the options, priorities, and context you provided.

You are comparing:

${optionList}

Your selected priorities are:

${priorityList}


COMPARISON

${cleanOptions
  .map(
    (option: string, index: number) => `
${option}

Position in this comparison: Option ${index + 1}

This option will be evaluated against the same criteria as the other choices, with particular attention to your selected priorities.
`
  )
  .join("\n")}


WHAT MATTERS MOST FOR YOU

${priorityList}

Your additional context:

${cleanContext}


TRADE-OFFS

There is no universal winner in a personalized comparison.

Different options can become more suitable depending on factors such as price, performance, features, long-term value, convenience, and the specific context you provided.

The live research version of VERDICT will use current web information to identify these trade-offs using real evidence.


VERDICT

Your comparison framework is ready.

The current version of VERDICT is using simulated research so you can test the complete product experience without consuming API credits.

When live research is enabled, this section will contain:

• A recommendation tailored to your priorities
• Evidence supporting that recommendation
• Important drawbacks and trade-offs
• Current information gathered from the web
• Source links for verification


SOURCES

Demo mode — live web sources will appear when the real research engine is connected.
`;

    return NextResponse.json({
      result,
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