export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#101828]">
      {/* Navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <div className="font-[family-name:var(--font-manrope)] text-xl font-bold tracking-[0.18em]">
          VERDICT
        </div>

        <div className="hidden items-center gap-10 font-[family-name:var(--font-manrope)] text-sm text-[#667085] md:flex">
          <a href="#how-it-works" className="transition hover:text-[#244B74]">
            How it works
          </a>

          <a href="#features" className="transition hover:text-[#244B74]">
            Features
          </a>

          <a href="#examples" className="transition hover:text-[#244B74]">
            Examples
          </a>
        </div>

        <button className="rounded-full bg-[#244B74] px-6 py-3 font-[family-name:var(--font-manrope)] text-sm font-semibold text-white transition hover:bg-[#193653]">
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-16 lg:grid-cols-2 lg:px-10 lg:pb-32 lg:pt-24">
        <div>
          <p className="mb-6 font-[family-name:var(--font-manrope)] text-xs font-bold tracking-[0.2em] text-[#244B74]">
            AI-POWERED DECISION RESEARCH
          </p>

          <h1 className="font-[family-name:var(--font-dm-serif)] text-6xl leading-[0.98] tracking-tight sm:text-7xl lg:text-8xl">
            Make decisions
            <br />
            <span className="text-[#244B74]">with confidence.</span>
          </h1>

          <p className="mt-8 max-w-xl font-[family-name:var(--font-manrope)] text-lg leading-8 text-[#667085]">
            Tell VERDICT what you&apos;re deciding. We&apos;ll research the
            options, compare the evidence, and help you find the choice that
            fits you best.
          </p>

          {/* Decision input */}
          <div className="mt-10 flex max-w-xl items-center rounded-2xl border border-[#D9D6CE] bg-white p-2 shadow-[0_15px_40px_rgba(16,24,40,0.06)]">
            <input
              type="text"
              placeholder="What are you trying to decide?"
              className="min-w-0 flex-1 bg-transparent px-4 py-4 font-[family-name:var(--font-manrope)] text-sm text-[#101828] outline-none placeholder:text-[#98A2B3]"
            />

            <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#244B74] text-xl text-white transition hover:bg-[#193653]">
              →
            </button>
          </div>

          <p className="mt-4 font-[family-name:var(--font-manrope)] text-xs text-[#98A2B3]">
            e.g. Which laptop should I buy for college and ML under ₹80,000?
          </p>
        </div>

        {/* Research preview */}
        <div className="relative">
          <div className="absolute -inset-6 rounded-[3rem] bg-[#D9B56D]/10 blur-3xl" />

          <div className="relative rounded-[2rem] border border-[#E4E1D9] bg-white p-6 shadow-[0_30px_80px_rgba(16,24,40,0.10)]">
            <div className="flex items-center justify-between border-b border-[#E4E1D9] pb-5">
              <div>
                <p className="font-[family-name:var(--font-manrope)] text-[10px] font-bold tracking-[0.18em] text-[#98A2B3]">
                  YOUR DECISION
                </p>

                <h2 className="mt-2 font-[family-name:var(--font-dm-serif)] text-2xl">
                  Best laptop for ML?
                </h2>
              </div>

              <span className="rounded-full bg-[#F1F6FA] px-3 py-1.5 font-[family-name:var(--font-manrope)] text-xs font-semibold text-[#244B74]">
                Researching
              </span>
            </div>

            <div className="py-6">
              <div className="mb-3 flex justify-between font-[family-name:var(--font-manrope)] text-xs">
                <span className="text-[#667085]">Web research</span>
                <span className="font-semibold text-[#101828]">87%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[#EDEAE3]">
                <div className="h-full w-[87%] rounded-full bg-[#244B74]" />
              </div>
            </div>

            <div className="space-y-3">
              {[
                ["MacBook Air", "9.1"],
                ["ASUS Vivobook", "8.6"],
                ["Lenovo IdeaPad", "8.2"],
              ].map(([name, score], index) => (
                <div
                  key={name}
                  className={`flex items-center justify-between rounded-xl border p-4 ${
                    index === 0
                      ? "border-[#D9B56D] bg-[#FBF8F0]"
                      : "border-[#E4E1D9]"
                  }`}
                >
                  <div>
                    <p className="font-[family-name:var(--font-manrope)] text-sm font-semibold">
                      {name}
                    </p>

                    <p className="mt-1 font-[family-name:var(--font-manrope)] text-xs text-[#98A2B3]">
                      {index === 0
                        ? "Best overall match"
                        : index === 1
                          ? "Best value"
                          : "Good all-rounder"}
                    </p>
                  </div>

                  <span className="font-[family-name:var(--font-dm-serif)] text-xl text-[#244B74]">
                    {score}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl bg-[#244B74] p-5 text-white">
              <div>
                <p className="font-[family-name:var(--font-manrope)] text-[10px] font-bold tracking-[0.15em] text-[#D9B56D]">
                  TOP RECOMMENDATION
                </p>

                <p className="mt-1 font-[family-name:var(--font-dm-serif)] text-xl">
                  MacBook Air
                </p>
              </div>

              <div className="font-[family-name:var(--font-dm-serif)] text-2xl">
                9.1/10
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-[#E4E1D9] bg-white">
        <div className="mx-auto grid max-w-7xl divide-y divide-[#E4E1D9] px-6 md:grid-cols-4 md:divide-x md:divide-y-0 lg:px-10">
          {[
            ["01", "Tell us", "Describe your decision naturally."],
            ["02", "We research", "Find current information across the web."],
            ["03", "We compare", "Analyze options against what matters."],
            ["04", "You decide", "Get a clear, evidence-backed verdict."],
          ].map(([number, title, description]) => (
            <div key={number} className="px-6 py-8 first:pl-0 last:pr-0">
              <span className="font-[family-name:var(--font-manrope)] text-xs font-bold text-[#D9B56D]">
                {number}
              </span>

              <h3 className="mt-3 font-[family-name:var(--font-dm-serif)] text-xl">
                {title}
              </h3>

              <p className="mt-2 font-[family-name:var(--font-manrope)] text-sm leading-6 text-[#667085]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32"
      >
        <div className="max-w-2xl">
          <p className="font-[family-name:var(--font-manrope)] text-xs font-bold tracking-[0.2em] text-[#244B74]">
            HOW IT WORKS
          </p>

          <h2 className="mt-5 font-[family-name:var(--font-dm-serif)] text-5xl leading-tight sm:text-6xl">
            From uncertainty
            <br />
            <span className="text-[#244B74]">to clarity.</span>
          </h2>

          <p className="mt-6 font-[family-name:var(--font-manrope)] text-lg leading-8 text-[#667085]">
            VERDICT turns a complicated decision into a simple,
            research-backed process.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#244B74] px-6 py-24 text-center text-white lg:py-32">
        <p className="font-[family-name:var(--font-manrope)] text-xs font-bold tracking-[0.2em] text-[#D9B56D]">
          READY?
        </p>

        <h2 className="mt-5 font-[family-name:var(--font-dm-serif)] text-5xl leading-tight sm:text-6xl">
          Your next decision
          <br />
          deserves a verdict.
        </h2>

        <button className="mt-10 rounded-full bg-[#F7F5EF] px-8 py-4 font-[family-name:var(--font-manrope)] text-sm font-bold text-[#244B74] transition hover:bg-white">
          Start researching →
        </button>
      </section>

      {/* Footer */}
      <footer className="flex flex-col items-center justify-between gap-4 bg-[#101828] px-6 py-8 text-white md:flex-row">
        <div className="font-[family-name:var(--font-manrope)] font-bold tracking-[0.18em]">
          VERDICT
        </div>

        <p className="font-[family-name:var(--font-manrope)] text-sm text-[#98A2B3]">
          Research. Compare. Decide.
        </p>

        <span className="font-[family-name:var(--font-manrope)] text-xs text-[#667085]">
          © 2026 VERDICT
        </span>
      </footer>
    </main>
  );
}
