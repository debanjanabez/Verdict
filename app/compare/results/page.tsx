"use client";

import { useEffect, useState } from "react";

type ComparisonData = {
  options: string[];
  priorities: string[];
  context: string;
};

export default function ResultsPage() {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [research, setResearch] = useState("");

  useEffect(() => {
  const savedData = sessionStorage.getItem("verdictComparison");
  const savedResearch = sessionStorage.getItem("verdictResearch");

  if (savedData) {
    setData(JSON.parse(savedData));
  }

  if (savedResearch) {
    setResearch(savedResearch);
  }
}, []);

  if (!data) {
    return (
      <main className="min-h-screen bg-[#F7F5EF] px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[#667085]">
            No comparison found.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5EF] px-6 py-20">
      <div className="mx-auto max-w-4xl">

        <p className="text-sm font-semibold tracking-[0.18em] text-[#244B74]">
          YOUR VERDICT
        </p>

        <h1 className="mt-3 font-[family-name:var(--font-dm-serif)] text-5xl text-[#101828]">
          {research ? "Your research is ready." : "Researching your options."}
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-[#667085]">
          {research
  ? "Here’s what the research found based on your priorities and context."
  : "VERDICT has everything it needs to compare your choices."}
        </p>

        <div className="mt-12 rounded-2xl border border-[#E4E1D9] bg-white p-8 shadow-sm">

          <h2 className="font-[family-name:var(--font-dm-serif)] text-2xl text-[#101828]">
            Your comparison
          </h2>

          <div className="mt-6 space-y-3">
            {data.options.map((option, index) => (
              <div
                key={index}
                className="rounded-xl bg-[#F7F5EF] px-5 py-4"
              >
                <p className="text-xs font-semibold tracking-wider text-[#667085]">
                  OPTION {index + 1}
                </p>

                <p className="mt-1 text-lg font-medium text-[#101828]">
                  {option}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold text-[#101828]">
              Your priorities
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {data.priorities.map((priority) => (
                <span
                  key={priority}
                  className="rounded-full bg-[#F1F0EA] px-4 py-2 text-sm text-[#244B74]"
                >
                  {priority}
                </span>
              ))}
            </div>
          </div>

          {data.context && (
            <div className="mt-8">
              <p className="text-sm font-semibold text-[#101828]">
                Your context
              </p>

              <p className="mt-2 rounded-xl bg-[#F7F5EF] p-4 text-sm leading-6 text-[#667085]">
                {data.context}
              </p>
            </div>
          )}

                </div>
        <div className="mt-8 rounded-2xl border border-[#D9B56D] bg-white p-8 shadow-sm">
  <p className="text-xs font-semibold tracking-[0.18em] text-[#244B74]">
    VERDICT
  </p>

  <h2 className="mt-3 font-[family-name:var(--font-dm-serif)] text-3xl text-[#101828]">
    Your decision is being researched.
  </h2>

  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667085]">
    VERDICT is analyzing your options against the priorities and context you provided.
  </p>
</div>
        {research && (
          <div className="mt-8 rounded-2xl border border-[#E4E1D9] bg-white p-8 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#244B74]">
              AI RESEARCH
            </p>

            <div className="mt-6 whitespace-pre-wrap font-[family-name:var(--font-manrope)] text-sm leading-7 text-[#344054]">
              {research}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}