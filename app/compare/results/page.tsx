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
          <p className="text-[#667085]">No comparison found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5EF] px-6 py-16">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-12">
          <p className="text-sm font-bold tracking-[0.2em] text-[#244B74]">
            YOUR VERDICT
          </p>

          <h1 className="mt-3 font-[family-name:var(--font-dm-serif)] text-5xl leading-tight text-[#101828] md:text-6xl">
            Your decision is ready.
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#667085]">
            VERDICT analyzed your options against the priorities and context
            you provided.
          </p>
        </div>

                {/* Verdict card */}
        <section className="rounded-3xl border border-[#D9B56D] bg-white p-8 shadow-sm md:p-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#244B74]">
                VERDICT
              </p>

              <h2 className="mt-3 font-[family-name:var(--font-dm-serif)] text-4xl leading-tight text-[#101828]">
                {data.options[0]} is the stronger choice.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#667085]">
                Based on the priorities and context you provided, this option
                is currently shown as the recommended choice.
              </p>

              <div className="mt-6 rounded-2xl bg-[#F7F5EF] p-5">
                <p className="text-xs font-bold tracking-[0.16em] text-[#244B74]">
                  WHY?
                </p>

                <p className="mt-2 text-sm leading-7 text-[#344054]">
                  This demo verdict is based on your selected priorities:
                  {data.priorities.join(", ")}.
                </p>
              </div>

              <p className="mt-4 text-xs leading-5 text-[#98A2B3]">
                Demo mode — the live research engine will determine the
                recommendation using current web research and evidence.
              </p>
            </div>

            <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F7F5EF] text-2xl text-[#244B74] md:flex">
              ✓
            </div>
          </div>
        </section>

        {/* Options */}
        <section className="mt-8">
          <div className="mb-5">
            <p className="text-xs font-bold tracking-[0.18em] text-[#244B74]">
              01
            </p>

            <h2 className="mt-2 font-[family-name:var(--font-dm-serif)] text-3xl text-[#101828]">
              Your comparison
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {data.options.map((option, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#E4E1D9] bg-white p-6 shadow-sm transition hover:-translate-y-0.5"
              >
                <p className="text-xs font-bold tracking-[0.16em] text-[#667085]">
                  OPTION {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className="mt-3 font-[family-name:var(--font-dm-serif)] text-2xl text-[#101828]">
                  {option}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#667085]">
                  Evaluated against your selected priorities and context.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison at a glance */}
        <section className="mt-12">
          <div className="mb-5">
            <p className="text-xs font-bold tracking-[0.18em] text-[#244B74]">
              02
            </p>

            <h2 className="mt-2 font-[family-name:var(--font-dm-serif)] text-3xl text-[#101828]">
              Comparison at a glance
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#667085]">
              A structured view of the criteria that matter to you.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-[#E4E1D9] bg-white shadow-sm">
            {/* Table header */}
            <div
              className="grid gap-4 border-b border-[#E4E1D9] bg-[#F7F5EF] px-6 py-5"
              style={{
                gridTemplateColumns: `1.4fr repeat(${data.options.length}, 1fr)`,
              }}
            >
              <p className="text-xs font-bold tracking-[0.12em] text-[#667085]">
                CRITERIA
              </p>

              {data.options.map((option, index) => (
                <p
                  key={index}
                  className="truncate text-sm font-bold text-[#101828]"
                >
                  {option}
                </p>
              ))}
            </div>

            {/* Priority rows */}
            {data.priorities.map((priority) => (
              <div
                key={priority}
                className="grid gap-4 border-b border-[#E4E1D9] px-6 py-5 last:border-b-0"
                style={{
                  gridTemplateColumns: `1.4fr repeat(${data.options.length}, 1fr)`,
                }}
              >
                <p className="text-sm font-semibold text-[#101828]">
                  {priority}
                </p>

                {data.options.map((option, index) => (
                  <p
                    key={`${priority}-${index}`}
                    className="text-sm leading-6 text-[#667085]"
                  >
                    Demo analysis
                  </p>
                ))}
              </div>
            ))}
          </div>

          <p className="mt-3 text-xs text-[#667085]">
            Demo mode — live research will replace these placeholders with
            verified information.
          </p>
        </section>

        {/* Priorities */}
        <section className="mt-12 rounded-3xl border border-[#E4E1D9] bg-white p-8 shadow-sm md:p-10">
          <p className="text-xs font-bold tracking-[0.18em] text-[#244B74]">
            03
          </p>

          <h2 className="mt-2 font-[family-name:var(--font-dm-serif)] text-3xl text-[#101828]">
            What matters to you
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#667085]">
            VERDICT used these priorities to frame the comparison.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {data.priorities.map((priority) => (
              <span
                key={priority}
                className="rounded-full border border-[#D9B56D] bg-[#FBF8F0] px-4 py-2 text-sm font-semibold text-[#244B74]"
              >
                {priority}
              </span>
            ))}
          </div>
        </section>

        {/* Context */}
        {data.context && (
          <section className="mt-8 rounded-3xl border border-[#E4E1D9] bg-white p-8 shadow-sm md:p-10">
            <p className="text-xs font-bold tracking-[0.18em] text-[#244B74]">
              04
            </p>

            <h2 className="mt-2 font-[family-name:var(--font-dm-serif)] text-3xl text-[#101828]">
              Your context
            </h2>

            <p className="mt-4 rounded-2xl bg-[#F7F5EF] p-5 text-sm leading-7 text-[#667085]">
              {data.context}
            </p>
          </section>
        )}

        {/* Bottom */}
        <div className="mt-12 border-t border-[#E4E1D9] pt-8 text-center">
          <p className="font-[family-name:var(--font-dm-serif)] text-2xl text-[#101828]">
            Research. Compare. Decide.
          </p>

          <p className="mt-2 text-sm text-[#667085]">
            VERDICT helps you make decisions with more clarity.
          </p>
        </div>

      </div>
    </main>
  );
}