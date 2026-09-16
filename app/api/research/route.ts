import OpenAI from "openai";
import { NextResponse } from "next/server";

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

    const prompt = `
You are the research engine for VERDICT, an AI-powered comparison platform.

The user wants to compare these options:

${options.map((option: string, index: number) => `${index + 1}. ${option}`).join("\n")}

The user's priorities are:

${priorities?.length
  ? priorities.map((priority: string) => `- ${priority}`).join("\n")
  : "- Overall value"}

Additional user context:

${context?.trim() || "No additional context provided."}

Your task:

1. Research each option using current information from the web.
2. Compare the options specifically according to the user's priorities and context.
3. Prefer reliable and relevant sources.
4. Do not invent facts, prices, specifications, reviews, or statistics.
5. Clearly distinguish verified facts from estimates or subjective opinions.
6. Consider important trade-offs rather than simply listing features.
7. Give a clear final verdict explaining which option best fits the user's stated priorities.
8. Mention important drawbacks of the recommended option.
9. Include useful source links/citations wherever possible.

Structure your response with these sections:

## Executive summary

## Comparison

## What matters most for this user

## Trade-offs

## Verdict

## Sources

Be concise but useful. The goal is to help the user make a well-informed decision.
`;

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      tools: [
        {
          type: "web_search",
        },
      ],
      input: prompt,
    });

    return NextResponse.json({
      result: response.output_text,
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