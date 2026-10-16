"use client";

import { useEffect, useState } from "react";

type ComparisonCell = {
  option: string;
  priority: string;
  score: number;
  analysis: string;
};

type ResearchResult = {
  mode: string;
  recommendation: string;
  recommendationReason: string;
  options: string[];
  priorities: string[];
  context: string;
  comparison: ComparisonCell[];
  tradeoffs: string[];
  sources: string[];
};

type ComparisonData = {
  options: string[];
  priorities: string[];
  context: string;
};

type HistoryEntry = {
  id: string;
  savedAt: string;
  fingerprint: string;
  data: ComparisonData;
  research: ResearchResult;
};

export default function ResultsPage() {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [research, setResearch] = useState<ResearchResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const savedData = sessionStorage.getItem("verdictComparison");
      const savedResearch = sessionStorage.getItem("verdictResearch");
      const parsedData = savedData ? (JSON.parse(savedData) as ComparisonData) : null;
      const parsedResearch = savedResearch
        ? (JSON.parse(savedResearch) as ResearchResult)
        : null;

      if (parsedData) setData(parsedData);
      if (parsedResearch) setResearch(parsedResearch);

      const savedHistory = localStorage.getItem("verdictHistory");
      const parsedHistory: HistoryEntry[] = savedHistory
        ? (JSON.parse(savedHistory) as HistoryEntry[])
        : [];

      if (parsedData && parsedResearch) {
        const fingerprint = JSON.stringify([parsedData, parsedResearch]);
        const existingEntry = parsedHistory.find(
          (entry) => entry.fingerprint === fingerprint
        );

        if (!existingEntry) {
          const newEntry: HistoryEntry = {
            id: fingerprint,
            fingerprint,
            savedAt: new Date().toISOString(),
            data: parsedData,
            research: parsedResearch,
          };
          const updatedHistory = [newEntry, ...parsedHistory].slice(0, 10);
          localStorage.setItem("verdictHistory", JSON.stringify(updatedHistory));
          setHistory(updatedHistory);
        } else {
          setHistory(parsedHistory);
        }
      } else {
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error("Could not load VERDICT history:", error);
      setHistory([]);
    }
  }, []);

  const reopenComparison = (entry: HistoryEntry) => {
    sessionStorage.setItem("verdictComparison", JSON.stringify(entry.data));
    sessionStorage.setItem("verdictResearch", JSON.stringify(entry.research));
    setData(entry.data);
    setResearch(entry.research);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearHistory = () => {
    localStorage.removeItem("verdictHistory");
    setHistory([]);
  };

  if (!data) {
    return (
      <main className="min-h-screen bg-[#F7F5EF] px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[#667085]">No comparison found.</p>
        </div>
      </main>
    );
  }

  // Calculate the overall score for every option
  const getOverallScore = (option: string) => {
    const scores = data.priorities
      .map((priority) => {
        const cell = research?.comparison.find(
          (item) =>
            item.option === option && item.priority === priority
        );

        return typeof cell?.score === "number" ? cell.score : null;
      })
      .filter((score): score is number => score !== null);

    if (scores.length === 0) return 0;

    return Math.round(
      scores.reduce((total, score) => total + score, 0) / scores.length
    );
  };

  const overallScores = data.options.map((option) => ({
    option,
    score: getOverallScore(option),
  }));

  const winner = [...overallScores].sort(
    (a, b) => b.score - a.score
  )[0];

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
            VERDICT researched your options against the priorities and
            context you provided.
          </p>
        </div>

        {/* Comparison history */}
        {history.length > 0 && (
          <section className="mb-10 rounded-3xl border border-[#E4E1D9] bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-[0.18em] text-[#244B74]">
                  YOUR SAVED DECISIONS
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-dm-serif)] text-2xl text-[#101828]">
                  Comparison history
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  Your latest {history.length} completed comparison{history.length === 1 ? "" : "s"}, saved in this browser.
                </p>
              </div>
              <button
                type="button"
                onClick={clearHistory}
                className="rounded-full border border-[#E4E1D9] px-4 py-2 text-xs font-bold text-[#667085] transition hover:border-red-200 hover:text-red-600"
              >
                Clear history
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-col justify-between gap-3 rounded-2xl border border-[#E4E1D9] bg-[#F7F5EF] p-4 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#101828]">
                      {entry.data.options.join(" vs ")}
                    </p>
                    <p className="mt-1 text-xs text-[#667085]">
                      {new Date(entry.savedAt).toLocaleDateString()} · {entry.data.priorities.length} priorities · Winner: {entry.research.recommendation}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => reopenComparison(entry)}
                    className="shrink-0 rounded-full bg-[#244B74] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#193653]"
                  >
                    View comparison
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Verdict */}
        <section className="rounded-3xl border border-[#D9B56D] bg-white p-8 shadow-sm md:p-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#244B74]">
                VERDICT
              </p>

              <h2 className="mt-3 font-[family-name:var(--font-dm-serif)] text-4xl leading-tight text-[#101828]">
                {winner?.option ||
                  research?.recommendation ||
                  data.options[0]}{" "}
                is the stronger choice.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#667085]">
                {research?.recommendationReason ||
                  "This recommendation is based on how well each option matches your selected priorities."}
              </p>

              <div className="mt-6 rounded-2xl bg-[#F7F5EF] p-5">
                <p className="text-xs font-bold tracking-[0.16em] text-[#244B74]">
                  WHY?
                </p>

                <p className="mt-2 text-sm leading-7 text-[#344054]">
                  The overall score is calculated from the average of the
                  scores across your selected priorities.
                </p>
              </div>
            </div>

            <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F7F5EF] text-2xl text-[#244B74] md:flex">
              ✓
            </div>
          </div>
        </section>

        {/* Overall Scoreboard */}
        <section className="mt-12">
          <div className="mb-5">
            <p className="text-xs font-bold tracking-[0.18em] text-[#244B74]">
              01
            </p>

            <h2 className="mt-2 font-[family-name:var(--font-dm-serif)] text-3xl text-[#101828]">
              Overall fit
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#667085]">
              How well each option matches everything you said matters.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {overallScores.map(({ option, score }, index) => {
              const isWinner = option === winner?.option;

              return (
                <div
                  key={option}
                  className={`rounded-3xl border bg-white p-6 shadow-sm transition ${
                    isWinner
                      ? "border-[#D9B56D] ring-2 ring-[#D9B56D]/20"
                      : "border-[#E4E1D9]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold tracking-[0.16em] text-[#667085]">
                        OPTION {String(index + 1).padStart(2, "0")}
                      </p>

                      <h3 className="mt-2 font-[family-name:var(--font-dm-serif)] text-2xl text-[#101828]">
                        {option}
                      </h3>
                    </div>

                    {isWinner && (
                      <span className="rounded-full bg-[#FBF8F0] px-3 py-1 text-xs font-bold text-[#244B74]">
                        WINNER
                      </span>
                    )}
                  </div>

                  <div className="mt-6 flex items-end justify-between">
                    <div>
                      <span className="font-[family-name:var(--font-dm-serif)] text-5xl text-[#244B74]">
                        {score}
                      </span>
                      <span className="ml-1 text-sm text-[#667085]">
                        / 100
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-[#667085]">
                      Overall fit
                    </p>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#EDEAE2]">
                    <div
                      className="h-full rounded-full bg-[#244B74] transition-all"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Detailed comparison */}
        <section className="mt-12">
          <div className="mb-5">
            <p className="text-xs font-bold tracking-[0.18em] text-[#244B74]">
              02
            </p>

            <h2 className="mt-2 font-[family-name:var(--font-dm-serif)] text-3xl text-[#101828]">
              Score by priority
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#667085]">
              See exactly how each option performed against your priorities.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[#E4E1D9] bg-white shadow-sm">
            <div className="min-w-[700px]">

              {/* Table header */}
              <div
                className="grid gap-4 border-b border-[#E4E1D9] bg-[#F7F5EF] px-6 py-5"
                style={{
                  gridTemplateColumns: `1.4fr repeat(${data.options.length}, 1fr)`,
                }}
              >
                <p className="text-xs font-bold tracking-[0.12em] text-[#667085]">
                  PRIORITY
                </p>

                {data.options.map((option, index) => (
                  <div key={option}>
                    <p className="truncate text-sm font-bold text-[#101828]">
                      {option}
                    </p>

                    <p className="mt-1 text-xs text-[#667085]">
                      Option {index + 1}
                    </p>
                  </div>
                ))}
              </div>

              {/* Score rows */}
              {data.priorities.map((priority) => (
                <div
                  key={priority}
                  className="grid gap-4 border-b border-[#E4E1D9] px-6 py-5 last:border-b-0"
                  style={{
                    gridTemplateColumns: `1.4fr repeat(${data.options.length}, 1fr)`,
                  }}
                >
                  <div>
                    <p className="text-sm font-semibold text-[#101828]">
                      {priority}
                    </p>
                  </div>

                  {data.options.map((option) => {
                    const cell = research?.comparison.find(
                      (item) =>
                        item.option === option &&
                        item.priority === priority
                    );

                    const score =
                      typeof cell?.score === "number"
                        ? cell.score
                        : 0;

                    return (
                      <div key={`${priority}-${option}`}>
                        <div className="flex items-baseline gap-1">
                          <span className="font-[family-name:var(--font-dm-serif)] text-2xl text-[#244B74]">
                            {score}
                          </span>

                          <span className="text-xs text-[#98A2B3]">
                            /100
                          </span>
                        </div>

                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EDEAE2]">
                          <div
                            className="h-full rounded-full bg-[#244B74]"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed option analysis */}
        <section className="mt-12">
          <div className="mb-5">
            <p className="text-xs font-bold tracking-[0.18em] text-[#244B74]">
              03
            </p>

            <h2 className="mt-2 font-[family-name:var(--font-dm-serif)] text-3xl text-[#101828]">
              The reasoning
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#667085]">
              Why each option received its individual scores.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {data.options.map((option, index) => (
              <div
                key={option}
                className="rounded-2xl border border-[#E4E1D9] bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-bold tracking-[0.16em] text-[#667085]">
                  OPTION {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className="mt-3 font-[family-name:var(--font-dm-serif)] text-2xl text-[#101828]">
                  {option}
                </h3>

                <div className="mt-5 space-y-5">
                  {data.priorities.map((priority) => {
                    const cell = research?.comparison.find(
                      (item) =>
                        item.option === option &&
                        item.priority === priority
                    );

                    return (
                      <div key={priority}>
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-xs font-bold text-[#244B74]">
                            {priority}
                          </p>

                          <p className="text-sm font-bold text-[#101828]">
                            {cell?.score ?? 0}/100
                          </p>
                        </div>

                        <p className="mt-1 text-sm leading-6 text-[#667085]">
                          {cell?.analysis || "Awaiting research"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Priorities */}
        <section className="mt-12 rounded-3xl border border-[#E4E1D9] bg-white p-8 shadow-sm md:p-10">
          <p className="text-xs font-bold tracking-[0.18em] text-[#244B74]">
            04
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
              05
            </p>

            <h2 className="mt-2 font-[family-name:var(--font-dm-serif)] text-3xl text-[#101828]">
              Your context
            </h2>

            <p className="mt-4 rounded-2xl bg-[#F7F5EF] p-5 text-sm leading-7 text-[#667085]">
              {data.context}
            </p>
          </section>
        )}

        {/* Sources */}
        {research?.sources && research.sources.length > 0 && (
          <section className="mt-8 rounded-3xl border border-[#E4E1D9] bg-white p-8 shadow-sm md:p-10">
            <p className="text-xs font-bold tracking-[0.18em] text-[#244B74]">
              06
            </p>

            <h2 className="mt-2 font-[family-name:var(--font-dm-serif)] text-3xl text-[#101828]">
              Sources & evidence
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#667085]">
              VERDICT used these sources while researching your comparison.
            </p>

            <div className="mt-6 space-y-3">
              {research.sources.map((source, index) => (
                <a
                  key={index}
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border border-[#E4E1D9] bg-[#F7F5EF] p-4 text-sm font-medium text-[#244B74] transition hover:border-[#D9B56D] hover:bg-[#FBF8F0]"
                >
                  <span className="mr-3 text-xs font-bold text-[#98A2B3]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {source}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Bottom */}
        <div className="mt-12 border-t border-[#E4E1D9] pt-10 text-center">
          <p className="font-[family-name:var(--font-dm-serif)] text-2xl text-[#101828]">
            Research. Compare. Decide.
          </p>

          <p className="mt-2 text-sm text-[#667085]">
            VERDICT helps you make decisions with more clarity.
          </p>

          <button
            onClick={() => {
              window.location.href = "/compare";
            }}
            className="mt-6 rounded-full bg-[#244B74] px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#193653]"
          >
            ← Start a new comparison
          </button>
        </div>
      </div>
    </main>
  );
}