"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const priorityOptions = [
  "Price",
  "Performance",
  "Quality",
  "Features",
  "Reviews",
  "Durability",
  "Battery",
  "Portability",
];

export default function ComparePage() {
  const router = useRouter();

  const [options, setOptions] = useState(["", ""]);
  const [context, setContext] = useState("");
  const [isResearching, setIsResearching] = useState(false);
 
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([
  "Performance",
  "Price",
]);

const [customPriority, setCustomPriority] = useState("");

const togglePriority = (priority: string) => {
  setSelectedPriorities((current) =>
    current.includes(priority)
      ? current.filter((item) => item !== priority)
      : [...current, priority]
  );
};

const addCustomPriority = () => {
  const priority = customPriority.trim();

  if (priority && !selectedPriorities.includes(priority)) {
    setSelectedPriorities([...selectedPriorities, priority]);
    setCustomPriority("");
  }
};

  const addOption = () => {
    if (options.length < 8) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const canCompare =
    options.length >= 2 && options.every((option) => option.trim() !== "");
  const handleVerdict = async () => {
  if (!canCompare) return;

  setIsResearching(true);

  const comparisonData = {
    options,
    priorities: selectedPriorities,
    context,
  };

  sessionStorage.setItem(
    "verdictComparison",
    JSON.stringify(comparisonData)
  );

  try {
    const response = await fetch("/api/research", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comparisonData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Research failed");
    }

    sessionStorage.setItem(
      "verdictResearch",
      result.result
    );

    router.push("/compare/results");
  } catch (error) {
    console.error(error);
    setIsResearching(false);
    alert("Something went wrong while researching. Please try again.");
  }
};
  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#101828]">
      {/* Navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a
          href="/"
          className="font-[family-name:var(--font-manrope)] text-xl font-bold tracking-[0.18em]"
        >
          VERDICT
        </a>

        <a
          href="/"
          className="font-[family-name:var(--font-manrope)] text-sm text-[#667085] transition hover:text-[#244B74]"
        >
          ← Back home
        </a>
      </nav>

      {/* Main */}
      <section className="mx-auto max-w-4xl px-6 pb-24 pt-16 lg:pt-24">
        <div className="text-center">
          <p className="font-[family-name:var(--font-manrope)] text-xs font-bold tracking-[0.2em] text-[#244B74]">
            COMPARE
          </p>

          <h1 className="mt-5 font-[family-name:var(--font-dm-serif)] text-5xl leading-tight sm:text-6xl">
            Put your options
            <br />
            <span className="text-[#244B74]">head to head.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl font-[family-name:var(--font-manrope)] text-base leading-7 text-[#667085]">
            Add two or more options. VERDICT will research them, compare what
            matters, and help you decide.
          </p>
        </div>

        {/* Options */}
        <div className="mt-14">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="font-[family-name:var(--font-manrope)] text-xs font-bold tracking-[0.15em] text-[#98A2B3]">
                STEP 01
              </p>

              <h2 className="mt-1 font-[family-name:var(--font-dm-serif)] text-2xl">
                What are you comparing?
              </h2>
            </div>

            <span className="font-[family-name:var(--font-manrope)] text-xs text-[#98A2B3]">
              {options.length}/8 options
            </span>
          </div>

          <div className="space-y-4">
            {options.map((option, index) => (
              <div
                key={index}
                className="group flex items-center gap-4 rounded-2xl border border-[#E4E1D9] bg-white p-3 shadow-[0_10px_30px_rgba(16,24,40,0.04)] transition focus-within:border-[#244B74]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F1F0EA] font-[family-name:var(--font-manrope)] text-sm font-bold text-[#244B74]">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder="Enter an option..."
                  className="min-w-0 flex-1 bg-transparent px-1 py-3 font-[family-name:var(--font-manrope)] text-base outline-none placeholder:text-[#98A2B3]"
                />

                {options.length > 2 && (
                  <button
                    onClick={() => removeOption(index)}
                    className="mr-2 flex h-9 w-9 items-center justify-center rounded-full text-[#98A2B3] transition hover:bg-[#F5F3EE] hover:text-[#101828]"
                    aria-label={`Remove option ${index + 1}`}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add option */}
          <button
            onClick={addOption}
            disabled={options.length >= 8}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#C9C5BB] py-4 font-[family-name:var(--font-manrope)] text-sm font-semibold text-[#244B74] transition hover:border-[#244B74] hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="text-xl leading-none">+</span>
            Add another option
          </button>
        </div>

        {/* Divider */}
        <div className="my-16 h-px bg-[#E4E1D9]" />

        {/* Priorities */}
<div>
  <p className="font-[family-name:var(--font-manrope)] text-xs font-bold tracking-[0.15em] text-[#98A2B3]">
    STEP 02
  </p>

  <h2 className="mt-1 font-[family-name:var(--font-dm-serif)] text-2xl">
    What matters to you?
  </h2>

  <p className="mt-3 font-[family-name:var(--font-manrope)] text-sm leading-6 text-[#667085]">
    Choose the factors that should influence your verdict.
  </p>

  {/* Priority buttons */}
  <div className="mt-6 flex flex-wrap gap-3">
    {priorityOptions.map((priority) => {
      const selected = selectedPriorities.includes(priority);

      return (
        <button
          key={priority}
          onClick={() => togglePriority(priority)}
          className={`rounded-full border px-4 py-2.5 font-[family-name:var(--font-manrope)] text-sm font-semibold transition ${
            selected
              ? "border-[#244B74] bg-[#244B74] text-white"
              : "border-[#E4E1D9] bg-white text-[#667085] hover:border-[#244B74] hover:text-[#244B74]"
          }`}
        >
          {selected && "✓ "}
          {priority}
        </button>
      );
    })}
  </div>

  {/* Custom priority */}
  <div className="mt-5 flex max-w-xl items-center rounded-xl border border-[#E4E1D9] bg-white p-2">
    <input
      value={customPriority}
      onChange={(e) => setCustomPriority(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          addCustomPriority();
        }
      }}
      placeholder="Add your own criterion..."
      className="min-w-0 flex-1 bg-transparent px-3 py-2 font-[family-name:var(--font-manrope)] text-sm outline-none placeholder:text-[#98A2B3]"
    />

    <button
      onClick={addCustomPriority}
      className="rounded-lg bg-[#F1F0EA] px-4 py-2 font-[family-name:var(--font-manrope)] text-sm font-semibold text-[#244B74] transition hover:bg-[#E8E6DE]"
    >
      Add
    </button>
  </div>

  {/* Selected priorities */}
  {selectedPriorities.length > 0 && (
    <div className="mt-8 rounded-2xl border border-[#E4E1D9] bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-[family-name:var(--font-dm-serif)] text-xl">
            Your priorities
          </h3>

          <p className="mt-1 font-[family-name:var(--font-manrope)] text-xs text-[#98A2B3]">
            VERDICT will use these when calculating your result.
          </p>
        </div>

        <span className="rounded-full bg-[#F1F0EA] px-3 py-1.5 font-[family-name:var(--font-manrope)] text-xs font-semibold text-[#244B74]">
          {selectedPriorities.length} selected
        </span>
      </div>

      <div className="mt-6 space-y-5">
        {selectedPriorities.map((priority, index) => {
          const weight =
            selectedPriorities.length === 1
              ? 100
              : Math.round(
                  (selectedPriorities.length - index) /
                    ((selectedPriorities.length *
                      (selectedPriorities.length + 1)) /
                      2) *
                    100
                );

          return (
            <div key={priority}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-[family-name:var(--font-manrope)] text-sm font-semibold">
                  {priority}
                </span>

                <span className="font-[family-name:var(--font-manrope)] text-sm text-[#667085]">
                  {weight}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[#EDEAE3]">
                <div
                  className="h-full rounded-full bg-[#244B74] transition-all duration-500"
                  style={{ width: `${weight}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )}
</div>

        {/* Compare button */}
        <div className="mt-14 flex justify-center">
          <button
  disabled={!canCompare || isResearching}
  onClick={handleVerdict}
  className="rounded-full bg-[#244B74] px-10 py-4 font-[family-name:var(--font-manrope)] text-sm font-bold text-white shadow-lg transition hover:bg-[#193653] disabled:cursor-not-allowed disabled:opacity-40"
>
  {isResearching ? "Researching the web..." : "Get my verdict →"}
</button>
        </div>

        {!canCompare && (
          <p className="mt-4 text-center font-[family-name:var(--font-manrope)] text-xs text-[#98A2B3]">
            Enter at least two options to continue.
          </p>
        )}
      </section>
      {/* Step 03 */}
<section className="mt-12">
  <div className="mb-6">
    <p className="text-sm font-semibold tracking-[0.18em] text-[#244B74]">
      STEP 03
    </p>

    <h2 className="mt-2 font-[family-name:var(--font-dm-serif)] text-3xl text-[#101828]">
      Add some context.
    </h2>

    <p className="mt-2 max-w-2xl text-[#667085]">
      Tell us anything about your situation that could affect the verdict.
    </p>
  </div>

  <div className="rounded-2xl border border-[#E4E1D9] bg-white p-6 shadow-sm">
    <textarea
      value={context}
      onChange={(e) => setContext(e.target.value)}
      placeholder="For example: I'm a college student and I care more about battery life and portability than gaming performance..."
      rows={5}
      className="w-full resize-none rounded-xl border border-[#E4E1D9] bg-[#F7F5EF] p-4 text-sm text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#244B74]"
    />

    <div className="mt-4 flex flex-wrap gap-2">
      {[
        "My budget is limited",
        "I'm a student",
        "I travel frequently",
        "I value long-term use",
      ].map((example) => (
        <button
          key={example}
          type="button"
          onClick={() => setContext(example)}
          className="rounded-full border border-[#E4E1D9] px-4 py-2 text-sm text-[#667085] transition hover:border-[#244B74] hover:text-[#244B74]"
        >
          {example}
        </button>
      ))}
    </div>
  </div>
</section>
    </main>
  );
}